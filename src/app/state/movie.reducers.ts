import { createReducer, on } from '@ngrx/store';
import { Movie } from '../models/movie.model';
import * as MovieActions from './movie.actions';

export interface MovieState {
  history: string[]; // search history
  query: string; // current search query
  movies: Movie[], // current search results
  error: string | null;
}

export const initialState: MovieState = {
  history: [],
  query: '',
  movies: [],
  error: null,
};

export const movieReducer = createReducer(
  initialState,
  on(MovieActions.searchMovies, (state, { query }) => ({ ...state, query })),
  on(MovieActions.searchMoviesSuccess, (state, { query, results }) => {
    if (results.length) {
      return {
        ...state,
        history: state.history.includes(query) ? state.history : [...state.history, query],
        movies: results,
      };
    }

    return { ...state, movies: results };
  }),
  on(MovieActions.searchMoviesFailure, (state, { error }) => ({ ...state, error }))
);
