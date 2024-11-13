import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MovieService } from '../services/movie.service';
import * as MovieActions from './movie.actions';

@Injectable()
export class MovieEffects {
  searchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.searchMovies),
      switchMap(
        action => this._movieService
          .search(action.query, action.page)
          .pipe(
            map(
              response => MovieActions.searchMoviesSuccess({
                query: action.query,
                results: response.Search || [],
                totalResults: Number(response.totalResults ?? 0)
              })
            ),
            catchError(error => of(MovieActions.searchMoviesFailure({ error: error.message })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private _movieService: MovieService
  ) { }
}
