import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminattendeeService {
  private baseUrl = `${environment.apiUrl}/attendees`;

  constructor(private http: HttpClient) {}

  //Save New Attendee
  create(attendee: any): Observable<any> {
    return this.http.post(this.baseUrl, attendee);
  }

  //Get All Attendees
  getAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
