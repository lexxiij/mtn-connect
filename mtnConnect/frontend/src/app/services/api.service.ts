import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  
  // Add attendee
  addAttendee(attendee: { name: string; email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/attendees`, attendee);
  }

  // Get attendees (optional)
  getAttendees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/attendees`);
  }
}
