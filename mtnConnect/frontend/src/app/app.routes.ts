// app.routes.ts

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

  // admin only
  { path: 'attendees',    component: AttendeeListComponent,  canActivate: [authGuard] },
  { path: 'admin-events', component: AdminEventsComponent,   canActivate: [authGuard] },
];
