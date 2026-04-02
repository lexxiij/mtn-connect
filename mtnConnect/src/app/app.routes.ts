// app.routes.ts — defines every URL path in the app and which component renders it.
//
// canActivate: [authGuard] means Angular will call the authGuard function
// BEFORE rendering that route. If the guard returns false (not logged in),
// it redirects to /login instead.

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './event-list/event-list.component';
import { RegistrationFormComponent } from './register/register-form.component';
import { AttendeeListComponent } from './adminattendee-list/adminattendee-list.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',         component: HomeComponent, pathMatch: 'full' },
  { path: 'home',     component: HomeComponent },
  { path: 'events',   component: EventListComponent },
  { path: 'register', component: RegistrationFormComponent },
  { path: 'contact',  component: ContactComponent },
  { path: 'login',    component: LoginComponent },

  // Protected admin routes — authGuard redirects to /login if not authenticated
  { path: 'attendees',    component: AttendeeListComponent,  canActivate: [authGuard] },
  { path: 'admin-events', component: AdminEventsComponent,   canActivate: [authGuard] },
];
