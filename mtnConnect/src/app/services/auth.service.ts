// handles login, logout, and storing the JWT token

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'mtn_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // starts as false unless a token is already saved from a previous session
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  private hasValidToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  get loggedIn$() {
    return this.isLoggedIn$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.isLoggedIn$.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn$.next(false);
  }
}
