import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = []
  searchControl: FormControl = new FormControl();

  constructor(private _movieService: MovieService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(query => query.length > 2)
      )
      .subscribe(query => this._search(query));
  }

  private _search(query: string) {
    this._movieService
      .search(query)
      .subscribe({
        next: response => {
          if (response.Response === 'True') {
            this.movies = response.Search;
          } else {
            this.movies = [];
          }
        }
      });
  }
}
