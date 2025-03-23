import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { type Event } from './pages/events/events.component'
import { type Animal } from './pages/adoption/adoption.component';
import { EventCreatePayload, EventResponse, EventUpdatePayload } from './admin-pages/admin-events/admin-events.component';

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

  getAdmin(bearerToken: string): Observable<AdminMess> {
    return this.http.get<AdminMess>("http://localhost:3000/admin", {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>("http://localhost:3000/animals").pipe(
      catchError(err => {
        console.error("Couldn't get animals data: ", err);
        return of([]);
      })
    );
  };

  putEvent(id: number, payload: EventUpdatePayload): Observable<EventResponse> {
    return this.http.put<EventResponse>(`http://localhost:3000/events/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't update event: ", err);
        throw err;
      })
    )
  }

  getAnimalByCode(petCode: string): Observable<Animal | null> {
    return this.http.get<Animal>(`http://localhost:3000/animals/${petCode}`).pipe(
      catchError(err => {
        console.error("Couldn't find pet:", err);
        return of(null);
      })
    );
  }

  delEvent(id: number): Observable<EventResponse> {
    return this.http.delete<EventResponse>(`http://localhost:3000/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't delete event: ", err);
        throw err;
      })
    );
  }

  submitAdoptionForm(adoptionData: any) {
    return this.http.post('http://localhost:3000/adoptees', adoptionData);
  }

  postEvent(payload: EventCreatePayload): Observable<EventResponse> {
    return this.http.post<EventResponse>("http://localhost:3000/events", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't create event: ", err);
        throw err;
      })
    );
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:3000/upload', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      reportProgress: true
    }).pipe(
      catchError(err => {
        console.error("Couldn't upload file: ", err);
        throw err;
      })
    );
  }
}
