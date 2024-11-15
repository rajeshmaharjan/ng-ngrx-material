import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MovieState } from "./movie.reducers";

export const selectMovieSearchState = createFeatureSelector<MovieState>('movieSearch');

export const selectLoading = createSelector(
  selectMovieSearchState,
  state => state.loading
);

export const selectSearchResults = createSelector(
  selectMovieSearchState,
  state => state.movies
);

export const selectSearchHistory = createSelector(
  selectMovieSearchState,
  state => state.history
);

export const selectTotalResults = createSelector(
  selectMovieSearchState,
  state => state.totalResults
);

export const selectHasMore = createSelector(
  selectMovieSearchState,
  state => state.hasMore
);

export const selectCurrentPage = createSelector(
  selectMovieSearchState,
  state => state.page
);
