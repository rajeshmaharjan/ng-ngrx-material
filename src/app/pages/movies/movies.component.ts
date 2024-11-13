import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { Movie } from '../../models/movie.model';
import { searchMovies } from '../../state/movie.actions';
import { selectHasMore, selectLoading, selectSearchHistory, selectSearchResults, selectTotalResults } from '../../state/movie.selectors';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {
  private _options: string[] = [];
  public filteredOptions!: Observable<string[]>;

  public searchControl: FormControl = new FormControl();

  loading$: Observable<boolean> = this._store.select(selectLoading);
  movies$: Observable<Movie[]> = this._store.select(selectSearchResults);
  searchHistory$: Observable<string[]> = this._store.select(selectSearchHistory);
  hasMore$: Observable<boolean> = this._store.select(selectHasMore);
  totalResults: Observable<number> = this._store.select(selectTotalResults);

  public currentPage: number = 1;

  constructor(private _store: Store) { }

  ngOnInit(): void {
    this.searchHistory$.subscribe(history => this._options = history);

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(query => query.trim().length > 2),
      )
      .subscribe({
        next: query => this._store.dispatch(searchMovies({ query: query, page: 1 }))
      });
  }

  public trackByFn(index: number, item: Movie): number {
    return index;
  }

  public onLoadMoreClick(): void {
    this._store.dispatch(searchMovies({ query: this.searchControl.value, page: ++this.currentPage }));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
