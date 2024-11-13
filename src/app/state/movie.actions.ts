import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie.model';

export const searchMovies = createAction(
  '[Movies] Search Movies',
  props<{
    query: string,
    page: number
  }>()
);

export const searchMoviesSuccess = createAction(
  '[Movies] Search Movies Success',
  props<{
    query: string,
    results: Movie[],
    totalResults: number
  }>()
);

export const searchMoviesFailure = createAction(
  '[Movies] Search Movies Failure',
  props<{ error: string }>()
);
