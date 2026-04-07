// admin page to add, edit, and delete events

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

  showForm = false;

  // null means we're creating a new event, otherwise it's the id of the one being edited
  editingId: string | null = null;


  formData: EventPayload = {
    title: '',
    date: '',
    time: '',
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

  openAddForm(): void {
    this.editingId = null;
    this.formData = { title: '', date: '', time: '', description: '', location: '', trainingType: '' };
    this.showForm = true;
    this.errorMsg = '';
    this.successMsg = '';
  }

  openEditForm(event: TrainingEvent): void {
    this.editingId = event._id;
    this.formData = {
      title: event.title,
      date: event.date,
      time: event.time || '',
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

  submit(form: NgForm): void {
    if (form.invalid) return;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.editingId) {
      this.eventsService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.successMsg = 'Event updated!';
          this.showForm = false;
          this.loadEvents();
        },
        error: () => { this.errorMsg = 'Failed to update event.'; },
      });
    } else {
      this.eventsService.create(this.formData).subscribe({
        next: () => {
          this.successMsg = 'Event created!';
          this.showForm = false;
          this.loadEvents();
        },
        error: () => { this.errorMsg = 'Failed to create event.'; },
      });
    }
  }

  deleteEvent(id: string, title: string): void {
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
