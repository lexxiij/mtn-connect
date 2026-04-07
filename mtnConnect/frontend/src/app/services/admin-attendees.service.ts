// services/admin-attendees.service.ts
// all attendee API calls

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { attendee } from '../models/attendee.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAttendeesService {
  private url = `${environment.apiUrl}/attendees`;

  constructor(private http: HttpClient) {}

  // GET /api/attendees
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
