// event-list/event-list.component.ts
// Shows training events on a FullCalendar.
// Events are now loaded from the backend API instead of being hardcoded.

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventsService, TrainingEvent } from '../services/events.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FullCalendarModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  calendarEvents: EventInput[] = [];
  loading = false;
  errorMsg = '';

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
    events: [],
  };

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getAll().subscribe({
      next: (events: TrainingEvent[]) => {
        console.log('Events from API:', events);

        this.calendarEvents = events.map((e) => ({
          id: e._id,
          title: e.title,
          date: e.date ? new Date(e.date) : new Date(), // always a Date object
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.calendarEvents,
        };

        this.loading = false;
      },
      error: () => {
        this.errorMsg =
          'Could not load events from server. Showing sample events.';
        this.calendarEvents = [
          { id: '1', title: 'Forklift Training Orientation', date: new Date('2026-05-17') },
          { id: '2', title: 'CDL Training Orientation', date: new Date('2026-05-18') },
        ];
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.calendarEvents,
        };
        this.loading = false;
      },
    });
  }

  handleDateClick(arg: DateClickArg) {
    console.log('Date clicked:', arg.dateStr);
    // TODO: pre-fill registration form for this date
  }

  trackById(index: number, event: EventInput) {
    return event.id;
  }
}
