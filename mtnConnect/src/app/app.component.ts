import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { AttendeeListComponent } from './attendee-list/attendee-list.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EventListComponent, RegistrationFormComponent, AttendeeListComponent, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Event-registration';
}

