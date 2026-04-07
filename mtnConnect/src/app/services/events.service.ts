// API calls for training events

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TrainingEvent {
  _id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
  trainingType?: string;
}

// used for create/update — _id doesn't exist yet so we omit it
export type EventPayload = Omit<TrainingEvent, '_id'>;

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TrainingEvent[]> {
    return this.http.get<TrainingEvent[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Error fetching events:', err);
        return of([]);
      })
    );
  }

  create(payload: EventPayload): Observable<TrainingEvent> {
    return this.http.post<TrainingEvent>(this.apiUrl, payload);
  }

  update(id: string, payload: EventPayload): Observable<TrainingEvent> {
    return this.http.put<TrainingEvent>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
