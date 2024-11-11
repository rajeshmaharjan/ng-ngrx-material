import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie.model';

export const searchMovies = createAction('[Movies] Search Movies', props<{ query: string }>());
export const searchMoviesSuccess = createAction('[Movies] Search Movies Success', props<{ movies: Movie[] }>());
export const searchMoviesFailure = createAction('[Movies] Search Movies Failure', props<{ error: string }>());
