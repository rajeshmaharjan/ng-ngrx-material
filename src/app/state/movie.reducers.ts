import { createReducer, on } from '@ngrx/store';
import { Movie } from '../models/movie.model';
import * as MovieActions from './movie.actions';

export interface MovieState {
  query: string; // current search query
  movies: Movie[], // current search results
  totalResults: number;
  loading: boolean;
  hasMore: boolean;
  history: string[]; // search history
  page: number;
  error: string | null;
}

export const initialState: MovieState = {
  query: '',
  movies: [],
  totalResults: 0,
  loading: false,
  hasMore: false,
  history: [],
  error: null,
  page: 1,
};

export const movieReducer = createReducer(
  initialState,
  on(MovieActions.searchMovies, (state, { query, page }) => ({
    ...state,
    query,
    loading: true,
    page,
  })),

  on(MovieActions.searchMoviesSuccess, (state, { query, results, totalResults }) => {
    let movies = state.page === 1 ? results : state.movies.concat(results),
      loading = false,
      hasMore = movies.length < totalResults,
      history = (results.length && !state.history.includes(query)) ? [...state.history, query] : state.history;

    return {
      ...state,
      movies,
      totalResults,
      loading,
      hasMore,
      history,
    };
  }),

  on(MovieActions.searchMoviesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
