import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
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

  public searchControl: FormControl = new FormControl();

  constructor(private _store: Store<MovieState>) { }

  ngOnInit(): void {
    this._store
      .pipe(
        select(state => state.movies)
      )
      .subscribe({
        next: movies => {
          console.log(movies);
          this.moviesSubject.next(movies)
        }
      })


    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(query => query.length > 2)
      )
      .subscribe({
        next: query => this._store.dispatch(searchMovies({ query }))
      });
  }
}
