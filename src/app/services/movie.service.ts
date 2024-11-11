import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  protected readonly apiPath: string = 'http://www.omdbapi.com';
  protected readonly apiKey: string = 'd81ddffc';

  constructor(private _http: HttpClient) { }

  public search(query: string) {
    return this._http.get(this.apiPath, {
      params: {
        s: query,
        apikey: this.apiKey
      }
    });
  }
}
