import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { Movie } from '../../models/movie.model';
import { searchMovies } from '../../state/movie.actions';
import { MovieState } from '../../state/movie.reducers';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  movies$: Observable<Movie[]> = this.moviesSubject.asObservable();

  private _options: string[] = [];
  public filteredOptions!: Observable<string[]>;

  public searchControl: FormControl = new FormControl();

  constructor(private _store: Store<{ movieSearch: MovieState }>) { }

  ngOnInit(): void {
    this._store
      .pipe(
        select(state => {
          console.log(state);
          return {
            history: state.movieSearch.history,
            movies: state.movieSearch.movies
          };
        })
      )
      .subscribe({
        next: ({ history, movies }) => {
          this._options = history;
          this.moviesSubject.next(movies);
        }
      });

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
        next: query => this._store.dispatch(searchMovies({ query }))
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
