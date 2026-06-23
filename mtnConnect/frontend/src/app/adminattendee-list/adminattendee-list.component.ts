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
  // Groups attendees by trainingType. For Shipyard Welding, attendees are
  // further split into sub-sections by their 1st-choice shift preference, and
  // each row is marked Yes/No in the Alternate column based on registration
  // date — no database field needed, it's calculated fresh every export.
  exportCSV(): void {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Date of Birth', 'County',
                     'Training Type', 'Heard From', 'Heard Other', 'Shift Preferences / Comments',
                     'Registered', 'Alternate'];

    // Anyone in Shipyard Welding who registered on/after this instant (midnight
    // UTC, June 8) registered "after the 7th" and is marked an alternate.
    // Only Shipyard Welding has an alternate/waitlist concept, so every other
    // training type just gets a blank in this column.
    const ALTERNATE_CUTOFF = new Date('2026-06-08T00:00:00Z');
    const isLateAlternate = (a: attendee): string => {
      const isWelding = (a.trainingType || '').toLowerCase().includes('shipyard');
      if (!isWelding) return '';
      if (!a.createdAt) return '';
      return new Date(a.createdAt) >= ALTERNATE_CUTOFF ? 'Yes' : 'No';
    };

    // Helper: wrap a value in quotes and escape any internal quotes
    const escape = (val: any): string => {
      const str = val == null ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Helper: parse a welding attendee's comments to find their 1st-choice shift.
    // The comments field looks like:
    //   "Shift Preferences (Top 3) — 1st (Priority): Shift A – 8:00 AM ..."
    // Returns e.g. "Shift A" or "Unassigned" if not found.
    const firstShift = (comments: string): string => {
      const match = (comments || '').match(/1st \(Priority\): Shift ([A-D])/i);
      return match ? `Shift ${match[1].toUpperCase()}` : 'Unassigned';
    };

    // Shift label map so sub-sections show the full shift name
    const shiftLabels: { [key: string]: string } = {
      'Shift A': 'Shift A — 8:00 AM to 12:00 PM (Weekday)',
      'Shift B': 'Shift B — 12:30 PM to 4:30 PM (Weekday)',
      'Shift C': 'Shift C — 5:00 PM to 9:00 PM (Weekday Evening)',
      'Shift D': 'Shift D — 8:00 AM to 4:00 PM (Weekend)',
    };

    // Group all attendees by trainingType
    const groups: { [type: string]: attendee[] } = {};
    for (const a of this.attendees) {
      const key = a.trainingType || 'Uncategorized';
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }

    const rows: string[] = [];

    // Helper: write one data row
    const writeRow = (a: attendee) => {
      const registered = a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '';
      rows.push([
        a.name, a.email, a.phone, a.address, a.dob,
        a.county, a.trainingType, a.heardFrom, a.heardOther,
        a.comments, registered, isLateAlternate(a)
      ].map(escape).join(','));
    };

    for (const [trainingType, members] of Object.entries(groups)) {
      rows.push(`"=== ${trainingType} ==="`);

      // Shipyard Welding gets broken down further by 1st-choice shift
      if (trainingType.toLowerCase().includes('shipyard')) {
        const shiftGroups: { [shift: string]: attendee[] } = {};
        for (const a of members) {
          const key = firstShift(a.comments);
          if (!shiftGroups[key]) shiftGroups[key] = [];
          shiftGroups[key].push(a);
        }

        // Sort shift groups so A, B, C, D always appear in order
        for (const shiftKey of Object.keys(shiftGroups).sort()) {
          const label = shiftLabels[shiftKey] ?? shiftKey;
          rows.push(`"  > ${label}"`);
          rows.push(headers.map(escape).join(','));
          shiftGroups[shiftKey].forEach(writeRow);
          rows.push(''); // blank line between shifts
        }

      } else {
        // All other training types — one flat list
        rows.push(headers.map(escape).join(','));
        members.forEach(writeRow);
        rows.push('');
      }
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
