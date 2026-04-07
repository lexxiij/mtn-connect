// services/admin-attendees.service.ts
// All HTTP calls related to attendees live here — NOT in the components.
// Components just call service methods and display the results.
//
// This is the "separation of concerns" pattern:
//   Component = display logic
//   Service   = data/business logic

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { attendee } from '../models/attendee.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAttendeesService {
  // All attendee endpoints start with this URL
  private url = `${environment.apiUrl}/attendees`;

  // HttpClient is injected by Angular's DI system (registered in app.config.ts)
  constructor(private http: HttpClient) {}

  // GET /api/attendees — returns an Observable that emits an array of attendees
  // The auth interceptor automatically adds the Bearer token header
  getAll(): Observable<attendee[]> {
    return this.http.get<attendee[]>(this.url);
  }

  // POST /api/attendees — create a new registration (used from register form)
  create(data: Omit<attendee, '_id' | 'createdAt'>): Observable<attendee> {
    return this.http.post<attendee>(this.url, data);
  }

  // PUT /api/attendees/:id — update an existing attendee
  update(id: string, data: Partial<attendee>): Observable<attendee> {
    return this.http.put<attendee>(`${this.url}/${id}`, data);
  }

  // DELETE /api/attendees/:id — remove an attendee
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
