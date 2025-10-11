import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Event {
  id: number;
  name: string;
  date: Date;
}


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events = [
    { id: 1, name: 'Forklift Training Orientation', date: '2025-11-17' },
    { id: 2, name: 'CDL Training Orientation', date: '2025-11-18' },
  ];

}


