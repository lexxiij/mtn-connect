// services/auth.service.ts
// Handles everything related to admin login/logout.
//
// KEY CONCEPTS for junior devs:
//   - Injectable service: one class, shared across the whole app via Angular's DI system
//   - BehaviorSubject: an RxJS "observable variable" that emits its current value
//     to any subscriber and also gives you the current value via .value
//   - localStorage: browser key/value storage that PERSISTS after page refresh

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'mtn_admin_token'; // the key we use to store the JWT in localStorage

@Injectable({ providedIn: 'root' })
export class AuthService {
  // BehaviorSubject(false) starts as "not logged in".
  // Components can subscribe to isLoggedIn$ to react when auth state changes.
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  // Called once at service creation: checks whether a token already exists
  // in localStorage (i.e. the user was previously logged in)
  private hasValidToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  // Returns the current login state synchronously (useful for guards)
  get isLoggedIn(): boolean {
    return this.isLoggedIn$.value;
  }

  // Returns the observable — use this in templates with async pipe
  get loggedIn$() {
    return this.isLoggedIn$.asObservable();
  }

  // Returns the stored JWT so the HTTP interceptor can attach it to requests
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // POST /api/auth/login
  // tap() lets us "side-effect" the response without changing it:
  // we save the token, then the observable passes the response along normally.
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
