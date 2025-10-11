import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './event-list/event-list.component';
import { RegistrationFormComponent } from './register/register-form.component';
import { AttendeeListComponent } from './adminattendee-list/adminattendee-list.component';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';





export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'events', component: EventListComponent },
  { path: 'register', component: RegistrationFormComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'attendees', component: AttendeeListComponent },

];
