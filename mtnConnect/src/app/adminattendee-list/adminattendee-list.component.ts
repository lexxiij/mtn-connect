import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { attendee } from '../models/attendee.model';
import { AdminAttendeesService } from '../services/admin-attendees.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendee-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './adminattendee-list.component.html',
  styleUrl: './adminattendee-list.component.css',
})
export class AttendeeListComponent implements OnInit {
  attendees: attendee[] = [];
  loading   = false;
  errorMsg  = '';

  // null means nothing is being edited right now
  editingId: string | null = null;
  editData: Partial<attendee> = {};

  constructor(
    private svc: AdminAttendeesService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAttendees();
  }

  loadAttendees(): void {
    this.loading  = true;
    this.errorMsg = '';

    this.svc.getAll().subscribe({
      next: (data) => {
        this.attendees = data;
        this.loading   = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to load attendees.';
        this.loading  = false;
      },
    });
  }

  // Enter edit mode for a specific attendee row
  startEdit(a: attendee): void {
    this.editingId = a._id!;
    // spread into a copy so changes don't affect the original until saved
    this.editData  = { ...a };
  }

  saveEdit(): void {
    if (!this.editingId) return;

    this.svc.update(this.editingId, this.editData).subscribe({
      next: (updated) => {
        const idx = this.attendees.findIndex(a => a._id === this.editingId);
        if (idx !== -1) this.attendees[idx] = updated;
        this.editingId = null;
        this.editData  = {};
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to update attendee.';
      },
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editData  = {};
  }

  deleteAttendee(a: attendee): void {
    if (!confirm(`Delete registration for ${a.name}? This cannot be undone.`)) return;

    this.svc.delete(a._id!).subscribe({
      next: () => {
        // filter it out locally instead of refetching the whole list
        this.attendees = this.attendees.filter(x => x._id !== a._id);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to delete attendee.';
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
