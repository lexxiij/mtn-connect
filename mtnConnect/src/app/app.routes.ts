import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { EventListComponent } from './event-list/event-list.component';
import { AttendeeListComponent } from './attendee-list/attendee-list.component';

export const routes: Routes = [
  { path: '', component: RegistrationFormComponent },
  { path: 'attendees', component: AttendeeListComponent },
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', component: EventListComponent },
];
