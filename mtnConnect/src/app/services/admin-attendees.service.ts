// all the API calls for attendees — keeping this out of the components

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { attendee } from '../models/attendee.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAttendeesService {
  private url = `${environment.apiUrl}/attendees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<attendee[]> {
    return this.http.get<attendee[]>(this.url);
  }

  create(data: Omit<attendee, '_id' | 'createdAt'>): Observable<attendee> {
    return this.http.post<attendee>(this.url, data);
  }

  update(id: string, data: Partial<attendee>): Observable<attendee> {
    return this.http.put<attendee>(`${this.url}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
