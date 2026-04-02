// guards/auth.guard.ts
// A "route guard" — Angular checks this before navigating to a protected route.
//
// HOW IT WORKS:
//   Angular calls canActivate() before rendering the /attendees page.
//   If the user is NOT logged in, the guard redirects them to /login instead.
//   If they ARE logged in, returning true allows navigation to proceed.
//
// We register this guard on the /attendees route in app.routes.ts.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true; // user is authenticated — allow the route
  }

  // Not logged in → redirect to login page
  router.navigate(['/login']);
  return false;
};
