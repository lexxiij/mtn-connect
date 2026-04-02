// admin-events/admin-events.component.ts
// Admin page for managing training events — create, edit, and delete.
// Protected by authGuard in app.routes.ts so only logged-in admins can access it.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventsService, TrainingEvent, EventPayload } from '../services/events.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css',
})
export class AdminEventsComponent implements OnInit {
  events: TrainingEvent[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';

  // Controls whether the add/edit form is visible
  showForm = false;

  // If editingId is set, we're editing that event. If null, we're creating a new one.
  editingId: string | null = null;

  // The form model — bound to the HTML form with ngModel
  formData: EventPayload = {
    title: '',
    date: '',
    description: '',
    location: '',
    trainingType: '',
  };

  constructor(
    private eventsService: EventsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventsService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load events.';
        this.loading = false;
      },
    });
  }

  // Open a blank form to add a new event
  openAddForm(): void {
    this.editingId = null;
    this.formData = { title: '', date: '', description: '', location: '', trainingType: '' };
    this.showForm = true;
    this.errorMsg = '';
    this.successMsg = '';
  }

  // Pre-fill the form with an existing event's data to edit it
  openEditForm(event: TrainingEvent): void {
    this.editingId = event._id;
    this.formData = {
      title: event.title,
      date: event.date,
      description: event.description || '',
      location: event.location || '',
      trainingType: event.trainingType || '',
    };
    this.showForm = true;
    this.errorMsg = '';
    this.successMsg = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  // Called when form is submitted — decides whether to create or update
  submit(form: NgForm): void {
    if (form.invalid) return;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.editingId) {
      // UPDATE existing event
      this.eventsService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMsg = 'Event updated!';
          this.showForm = false;
          this.loadEvents(); // refresh the list
        },
        error: () => { this.errorMsg = 'Failed to update event.'; },
      });
    } else {
      // CREATE new event
      this.eventsService.create(this.formData).subscribe({
        next: () => {
          this.successMsg = 'Event created!';
          this.showForm = false;
          this.loadEvents(); // refresh the list
        },
        error: () => { this.errorMsg = 'Failed to create event.'; },
      });
    }
  }

  deleteEvent(id: string, title: string): void {
    // window.confirm() shows a browser dialog — simple way to prevent accidents
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    this.eventsService.delete(id).subscribe({
      next: () => {
        this.successMsg = 'Event deleted.';
        this.loadEvents();
      },
      error: () => { this.errorMsg = 'Failed to delete event.'; },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
