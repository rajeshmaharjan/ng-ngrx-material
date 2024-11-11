import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieSearchResponse } from '../models/movie-search-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  protected readonly apiPath: string = 'http://www.omdbapi.com';
  protected readonly apiKey: string = 'd81ddffc';

  constructor(private _http: HttpClient) { }

  public search(query: string, page: number = 1): Observable<MovieSearchResponse> {
    return this._http.get<MovieSearchResponse>(this.apiPath, {
      params: {
        s: query,
        page: page,
        apikey: this.apiKey
      }
    });
  }
}
