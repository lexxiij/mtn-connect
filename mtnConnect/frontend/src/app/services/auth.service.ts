// services/auth.service.ts
// handles login, logout, and token storage

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'mtn_admin_token'; // the key we use to store the JWT in localStorage

@Injectable({ providedIn: 'root' })
export class AuthService {
  // starts as logged out, updates when user logs in/out
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  // check if user is still logged in from last session
  private hasValidToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  // used by guards
  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  get loggedIn$() {
    return this.isLoggedIn$.asObservable();
  }

  // used by the interceptor to add auth header
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // POST /api/auth/login — save token on success
  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token); // save JWT
          this.isLoggedIn$.next(true);                // notify subscribers
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn$.next(false);
  }
}
