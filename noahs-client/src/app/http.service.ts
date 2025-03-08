import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  getTest(): Observable<Object> {
    return this.http.get("http://localhost:3000/users", {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    }
    ).pipe(
      catchError(err => {
        console.error("Couldn't get data: ", err);
        return of([])
      })
    )
  }
}
