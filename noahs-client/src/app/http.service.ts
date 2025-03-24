import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { type Event } from './pages/events/events.component'
import { type Animal } from './pages/adoption/adoption.component';
import { EventCreatePayload, EventResponse, EventUpdatePayload } from './admin-pages/admin-events/admin-events.component';
import { AnimalCreatePayload, AnimalResponse, AnimalUpdatePayload } from './admin-pages/admin-adoption/admin-adoption.component';

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
  //url: string = "https://noahs-ark-shelter.onrender.com/";
  url: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.url}/events`, {}
    ).pipe(
      catchError(err => {
        console.error("Couldn't get data: ", err);
        return of([])
      })
    )
  }

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.url}/animals`).pipe(
      catchError(err => {
        console.error("Couldn't get animals data: ", err);
        return of([]);
      })
    );
  };

  getAnimalByCode(petCode: string): Observable<Animal | null> {
    return this.http.get<Animal>(`${this.url}/animals/${petCode}`).pipe(
      catchError(err => {
        console.error("Couldn't find pet:", err);
        return of(null);
      })
    );
  }

  getAdmin(bearerToken: string): Observable<AdminMess> {
    return this.http.get<AdminMess>(`${this.url}/admin`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
  }

  loginAdmin(email: string, password: string): Observable<JWT> {
    return this.http.post<JWT>(`${this.url}/login`,
      { email, password })
  }

  putEvent(id: number, payload: EventUpdatePayload): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.url}/events/${id}`, payload, {
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

  putAnimal(id: number, payload: AnimalUpdatePayload): Observable<AnimalResponse> {
    return this.http.put<AnimalResponse>(`${this.url}/animals/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't update animal: ", err);
        throw err;
      })
    )
      .pipe(
        catchError(err => {
          console.error("Couldn't update animal: ", err);
          throw err;
        })
      )
  }

  delEvent(id: number): Observable<EventResponse> {
    return this.http.delete<EventResponse>(`${this.url}/events/${id}`, {
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

  delAnimal(id: number): Observable<AnimalResponse> {
    return this.http.delete<AnimalResponse>(`${this.url}/animals/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't delete animal: ", err);
        throw err;
      })
    );
  }

  submitAdoptionForm(adoptionData: any) {
    return this.http.post(`${this.url}/adoptees`, adoptionData);
  }

  postEvent(payload: EventCreatePayload): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.url}/events`, payload, {
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

  postAnimal(payload: AnimalCreatePayload): Observable<AnimalResponse> {
    return this.http.post<AnimalResponse>(`${this.url}/animals`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(err => {
        console.error("Couldn't create animal: ", err);
        throw err;
      })
    );
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/upload`, formData, {
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
