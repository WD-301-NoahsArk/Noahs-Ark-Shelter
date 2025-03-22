import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { type Event } from './pages/events/events.component'
import { type Animal } from './pages/adoption/adoption.component';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>("http://localhost:3000/events", {}
    ).pipe(
      catchError(err => {
        console.error("Couldn't get data: ", err);
        return of([])
      })
    )
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>("http://localhost:3000/animals").pipe(
      catchError(err => {
        console.error("Couldn't get animals data: ", err);
        return of([]);
      })
    );
  }
}
