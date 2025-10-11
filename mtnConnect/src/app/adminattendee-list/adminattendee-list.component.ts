import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-attendee-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './adminattendee-list.component.html',
  styleUrl: './adminattendee-list.component.css'
})
export class AttendeeListComponent {

}
