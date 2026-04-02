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
  date: string; // ISO string from MongoDB
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  // Uses environment.apiUrl so Angular swaps localhost ↔ production URL automatically
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  // Fetch all events
  getAll(): Observable<TrainingEvent[]> {
    return this.http.get<TrainingEvent[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Error fetching events:', err);
        // Return empty array if backend is unreachable
        return of([]);
      })
    );
  }
}
