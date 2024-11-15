import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Movie } from '../../models/movie.model';
import { searchMovies } from '../../state/movie.actions';
import { selectCurrentPage, selectHasMore, selectLoading, selectSearchHistory, selectSearchResults, selectTotalResults } from '../../state/movie.selectors';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) virtualScrollViewport!: CdkVirtualScrollViewport;

  private _options: string[] = [];
  public filteredOptions!: Observable<string[]>;

  public searchControl: FormControl = new FormControl();

  loading$: Observable<boolean> = this._store.select(selectLoading);
  movies$: Observable<Movie[]> = this._store.select(selectSearchResults);
  searchHistory$: Observable<string[]> = this._store.select(selectSearchHistory);
  hasMore$: Observable<boolean> = this._store.select(selectHasMore);
  totalResults$: Observable<number> = this._store.select(selectTotalResults);
  currentPage$: Observable<number> = this._store.select(selectCurrentPage);

  public currentPage!: number;
  public loading!: boolean;
  public hasMore!: boolean;

  private _destroyed$ = new Subject<void>();

  constructor(private _store: Store) { }

  ngOnInit(): void {
    this._subscribeStateChanges();
    this._handleSearchInputChanges();
  }

  ngAfterViewInit(): void {
    this._registerViewportScrollEvent();
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public trackByFn(index: number, item: Movie): number {
    return index;
  }

  public onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://placehold.co/300x450?text=Poster\\nNot\\nFound';
  }

  private _subscribeStateChanges(): void {
    this.searchHistory$.pipe(takeUntil(this._destroyed$)).subscribe(history => this._options = history);
    this.currentPage$.pipe(takeUntil(this._destroyed$)).subscribe(page => this.currentPage = page);
    this.loading$.pipe(takeUntil(this._destroyed$)).subscribe(loading => this.loading = loading);
    this.hasMore$.pipe(takeUntil(this._destroyed$)).subscribe(hasMore => this.hasMore = hasMore);
  }

  private _handleSearchInputChanges(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      takeUntil(this._destroyed$)
    );

    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter(query => query.trim().length > 2),
        takeUntil(this._destroyed$)
      )
      .subscribe({
        next: query => {
          this.virtualScrollViewport.scrollToIndex(0);
          this._store.dispatch(searchMovies({ query: query, page: 1 }))
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _registerViewportScrollEvent(): void {
    fromEvent(this.virtualScrollViewport.elementRef.nativeElement, 'scroll')
      .pipe(
        debounceTime(250),
        takeUntil(this._destroyed$)
      )
      .subscribe({
        next: () => {
          if (this.loading) return;

          if (!this.hasMore) return;

          if (this.virtualScrollViewport.measureScrollOffset('bottom') > 200) return;

          this._store.dispatch(searchMovies({ query: this.searchControl.value, page: this.currentPage + 1 }));
        }
      });
  }
}
