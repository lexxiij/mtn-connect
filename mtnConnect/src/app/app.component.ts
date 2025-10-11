import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { RegistrationFormComponent } from './register/register-form.component';
import { AttendeeListComponent } from './adminattendee-list/adminattendee-list.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Event-Registration';
}

