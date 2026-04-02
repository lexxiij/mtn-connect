// services/auth.interceptor.ts
// A "functional interceptor" — runs for EVERY HTTP request your app makes.
//
// WHAT IT DOES:
//   If the user is logged in and has a JWT token, this interceptor
//   automatically clones the outgoing request and adds the header:
//     Authorization: Bearer <token>
//
// WHY THIS IS USEFUL:
//   Without this, you'd have to manually add the Authorization header in
//   every single service method. The interceptor does it once, globally.
//
// Angular 17+ uses functional interceptors (just a function, not a class).

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() works inside functional interceptors (can't use constructor DI here)
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    // req.clone() creates a copy with the new header added
    // We never mutate the original request — Angular requests are immutable
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq); // pass the modified request along
  }

  return next(req); // no token → pass the original request unchanged
};
