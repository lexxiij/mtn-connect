import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';



@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FullCalendarModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  events = [
    { id: 1, name: 'Forklift Training Orientation', date: '2025-11-17' },
    { id: 2, name: 'CDL Training Orientation', date: '2025-11-18' },
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: '90%',
    contentHeight: 'auto',
    aspectRatio: 1,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
    { title: 'Forklift Training Orientation', date: '2025-11-17' },
    { title: 'CDL Training Orientation', date: '2025-11-18' },
  ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }

}

