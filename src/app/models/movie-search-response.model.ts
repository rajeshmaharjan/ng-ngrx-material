import { Movie } from "./movie.model";

export interface MovieSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
