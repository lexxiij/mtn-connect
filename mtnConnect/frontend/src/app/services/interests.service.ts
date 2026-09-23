// services/interests.service.ts
// All API calls for the interest list live here (components never call HttpClient directly).

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InterestsService {
  private url = `${environment.apiUrl}/interests`;

  constructor(private http: HttpClient) {}

  // POST /api/interests — public, used by the interest form
  create(data: Omit<Interest, '_id' | 'createdAt'>): Observable<Interest> {
    return this.http.post<Interest>(this.url, data);
  }

  // GET /api/interests — admin only (auth.interceptor adds the token)
  getAll(): Observable<Interest[]> {
    return this.http.get<Interest[]>(this.url);
  }

  // DELETE /api/interests/:id — admin only
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
