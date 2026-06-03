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

  // Track which row is being edited (null = no row in edit mode)
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
    // copy so we don't edit the original
    this.editData  = { ...a };
  }

  // Save the edited row to the backend
  saveEdit(): void {
    if (!this.editingId) return;

    this.svc.update(this.editingId, this.editData).subscribe({
      next: (updated) => {
        // Replace the old record in our local array with the updated one
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

  // Delete an attendee after confirmation
  deleteAttendee(a: attendee): void {
    if (!confirm(`Delete registration for ${a.name}? This cannot be undone.`)) return;

    this.svc.delete(a._id!).subscribe({
      next: () => {
        // Remove from local array (no need to refetch the whole list)
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

  // ── CSV Export ──────────────────────────────────────────────────────────────
  // Groups attendees by trainingType, writes a CSV section for each, and
  // triggers a file download in the browser — no backend needed.
  exportCSV(): void {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Date of Birth', 'County',
                     'Training Type', 'Heard From', 'Heard Other', 'Comments', 'Registered'];

    // Helper: wrap a value in quotes and escape any internal quotes
    const escape = (val: any): string => {
      const str = val == null ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Group attendees by trainingType
    const groups: { [type: string]: attendee[] } = {};
    for (const a of this.attendees) {
      const key = a.trainingType || 'Uncategorized';
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }

    const rows: string[] = [];

    for (const [trainingType, members] of Object.entries(groups)) {
      // Section header — bold label row (capitalised training type)
      rows.push(`"=== ${trainingType} ==="`);
      rows.push(headers.map(escape).join(','));

      for (const a of members) {
        const registered = a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '';
        rows.push([
          a.name, a.email, a.phone, a.address, a.dob,
          a.county, a.trainingType, a.heardFrom, a.heardOther,
          a.comments, registered
        ].map(escape).join(','));
      }

      // Blank line between sections
      rows.push('');
    }

    const csvContent = rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href     = url;
    link.download = `attendees-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
