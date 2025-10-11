import { Component } from '@angular/core';
import { EventListComponent } from '../event-list/event-list.component';
import { ContactComponent } from '../contact/contact.component';
import { RegistrationFormComponent } from '../register/register-form.component';
import { AttendeeListComponent } from '../adminattendee-list/adminattendee-list.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
