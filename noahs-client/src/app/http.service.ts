import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { type Event } from './pages/events/events.component'

type JWT = {
  token: string
}

type AdminMess = {
  message: string
}

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

  loginAdmin(email: string, password: string): Observable<JWT> {
    return this.http.post<JWT>("http://localhost:3000/login",
      { email, password })
  }

  goAdmin(bearerToken: string) : Observable<AdminMess> {
    return this.http.get<AdminMess>("http://localhost:3000/admin", {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
  }
}
