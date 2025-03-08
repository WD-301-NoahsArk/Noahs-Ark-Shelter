import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http: HttpClient) { }

  getTest() {
    return this.http.get("http://localhost:3000/users").pipe(
      catchError(err => {
        console.error('Error occured:', err)
        return of([])
      })
    )
  }
}

