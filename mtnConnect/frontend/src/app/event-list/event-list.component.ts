// event-list/event-list.component.ts
// Shows training events on a FullCalendar.
// Events are now loaded from the backend API instead of being hardcoded.

import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
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

  // Modal state
  showOrientationModal = false;
  // Holds the event that was clicked so the modal can show its title
  // and the Register Now button knows which route to go to
  selectedEvent: EventInput | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: '100%',
    fixedWeekCount: false,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    // eventClick fires when the user clicks an event tile on the calendar itself
    eventClick: (arg) => this.handleEventClick(arg),
    events: [],
  };

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getAll().subscribe({
      next: (events: TrainingEvent[]) => {
        console.log('Events from API:', events);

        // Only show today's events and future events.
        // Dates are stored as "YYYY-MM-DD" strings, so string comparison
        // works correctly — lexicographic order matches chronological order.
        const today = new Date().toISOString().split('T')[0]; // e.g. "2026-05-26"
        const upcomingEvents = events.filter(e => e.date >= today);

        this.calendarEvents = upcomingEvents.map((e) => ({
          id: e._id,
          title: e.title,
          date: e.date ?? new Date().toISOString().split('T')[0],
          // extendedProps is FullCalendar's way of storing custom data on an event.
          // We stash trainingType here so our click handler can read it later.
          extendedProps: { trainingType: e.trainingType, description: e.description, time: e.time, endTime: e.endTime },
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
          { id: '1', title: 'Forklift Training Orientation', date: '2026-05-17' },
          { id: '2', title: 'CDL Training Orientation', date: '2026-05-18' },
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
  }

  // Called when the user clicks an event tile directly on the calendar grid.
  // arg.event gives us the FullCalendar event object, including extendedProps.
  handleEventClick(arg: EventClickArg): void {
    this.navigateToRegister({
      id:            arg.event.id,
      title:         arg.event.title,
      extendedProps: arg.event.extendedProps,
    });
  }

  // All events now open the info modal first so users see the time,
  // location, and what to bring before they register.
  navigateToRegister(event: EventInput): void {
    this.selectedEvent = event;
    this.showOrientationModal = true;
  }

  closeModal(): void {
    this.showOrientationModal = false;
    this.selectedEvent = null;
  }

  // Called when the user clicks "Register Now" inside the modal.
  // Routes to the right form based on the event's trainingType.
  registerFromModal(): void {
    // Capture what we need BEFORE clearing selectedEvent
    const trainingType = this.selectedEvent?.extendedProps?.['trainingType'] ?? '';
    const eventId      = this.selectedEvent?.id;
    const eventTitle   = this.selectedEvent?.title;

    this.showOrientationModal = false;
    this.selectedEvent = null;

    // Case-insensitive check so minor casing differences in the admin form
    // ("shipyard welding", "Shipyard welding", etc.) still route correctly.
    if (trainingType.toLowerCase().includes('shipyard')) {
      this.router.navigate(['/shipyard-welding']);
    } else {
      this.router.navigate(['/register'], {
        queryParams: { eventId, eventTitle },
      });
    }
  }

  trackById(index: number, event: EventInput) {
    return event.id;
  }

  // Converts "HH:MM" (24-hour) from the admin form into "H:MM AM/PM" for display.
  // Returns null if no time was set so the template can show a fallback.
  formatTime(raw: string | undefined): string | null {
    if (!raw) return null;
    const [h, m] = raw.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour   = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }
}
