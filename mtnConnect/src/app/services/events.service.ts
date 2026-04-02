// services/events.service.ts
// HTTP calls for training events.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Define the type for a training event
export interface TrainingEvent {
  _id: string;
  title: string;
  date: string;
  description?: string;
  location?: string;
  trainingType?: string;
}

// Type for creating/updating — no _id needed
export type EventPayload = Omit<TrainingEvent, '_id'>;

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  // Uses environment.apiUrl so Angular swaps localhost ↔ production URL automatically
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

  // POST /api/events — admin only (auth interceptor adds the token automatically)
  create(payload: EventPayload): Observable<TrainingEvent> {
    return this.http.post<TrainingEvent>(this.apiUrl, payload);
  }

  // PUT /api/events/:id — admin only
  update(id: string, payload: EventPayload): Observable<TrainingEvent> {
    return this.http.put<TrainingEvent>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE /api/events/:id — admin only
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
