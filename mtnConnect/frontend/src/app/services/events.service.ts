// services/events.service.ts
// HTTP calls for training events.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TrainingEvent {
  _id: string;
  title: string;
  date: string;
  time?: string;        // "HH:MM" — optional, shown alongside the date
  description?: string;
  location?: string;
  trainingType?: string;
}

// payload type (no _id)
export type EventPayload = Omit<TrainingEvent, '_id'>;

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  // GET /api/events — public, no auth needed
  getAll(): Observable<TrainingEvent[]> {
    return this.http.get<TrainingEvent[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Error fetching events:', err);
        return of([]);
      })
    );
  }

  // POST /api/events
  create(payload: EventPayload): Observable<TrainingEvent> {
    return this.http.post<TrainingEvent>(this.apiUrl, payload);
  }

  // PUT /api/events/:id
  update(id: string, payload: EventPayload): Observable<TrainingEvent> {
    return this.http.put<TrainingEvent>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE /api/events/:id
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
