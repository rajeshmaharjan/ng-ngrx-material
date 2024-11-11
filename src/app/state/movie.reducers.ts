import { createReducer, on } from '@ngrx/store';
import { Movie } from '../models/movie.model';
import * as MovieActions from './movie.actions';

export interface MovieState {
  movies: Movie[];
  searchQuery: string;
  error: string;
}

export const initialState: MovieState = {
  movies: [],
  searchQuery: '',
  error: ''
};

export const movieReducer = createReducer(
  initialState,
  on(MovieActions.searchMovies, (state, { query }) => ({ ...state, searchQuery: query })),
  on(MovieActions.searchMoviesSuccess, (state, { movies }) => ({ ...state, movies })),
  on(MovieActions.searchMoviesFailure, (state, { error }) => ({ ...state, error }))
);
