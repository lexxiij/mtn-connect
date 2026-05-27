// Shipyard Welding orientation registration form.
// Extends the standard registration with a full class schedule display
// and a ranked shift-preference selector (Shifts A–D).

import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAttendeesService } from '../services/admin-attendees.service';

// A simple type to keep shift data together
interface ShiftOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-shipyard-welding-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './shipyard-welding-register.component.html',
  styleUrls: ['./shipyard-welding-register.component.css'],
})
export class ShipyardWeldingRegisterComponent {

  // ── Standard fields ────────────────────────────────────────────────────────
  fullName   = '';
  email      = '';
  phone      = '';
  dob        = '';
  county     = '';
  heardFrom  = '';
  heardOther = '';
  comments   = '';

  // ── Shift ranking fields ───────────────────────────────────────────────────
  // Users rank their top 3 shift preferences (not all 4).
  shift1 = '';
  shift2 = '';
  shift3 = '';
  shiftError = '';

  // ── UI state ───────────────────────────────────────────────────────────────
  submitted = false;
  success   = false;
  loading   = false;
  errorMsg  = '';

  // ── Static data ────────────────────────────────────────────────────────────
  // readonly = this array never changes at runtime, which is good practice.
  readonly shifts: ShiftOption[] = [
    { value: 'A', label: 'Shift A – 8:00 AM to 12:00 PM (Weekday)' },
    { value: 'B', label: 'Shift B – 12:30 PM to 4:30 PM (Weekday)' },
    { value: 'C', label: 'Shift C – 5:00 PM to 9:00 PM (Weekday Evening)' },
    { value: 'D', label: 'Shift D – 8:00 AM to 4:00 PM (Weekend)' },
  ];

  readonly missouriCounties: string[] = [
    'Mississippi', 'Scott', 'New Madrid', 'Pemiscot', 'Butler',
    'Bollinger', 'Dunklin', 'Cape Girardeau', 'Perry',
    'Saint Francois', 'Stoddard', 'Saint Genevieve',
  ];

  constructor(private attendeesSvc: AdminAttendeesService) {}

  // ── availableFor(slot) ────────────────────────────────────────────────────
  // Returns the shifts the user can still pick for a given rank slot by
  // filtering out whatever was already chosen in the earlier slots.
  //
  // Example: if shift1 = 'A' and shift2 = 'C', then slot 3 only shows B and D.
  availableFor(slot: number): ShiftOption[] {
    // Build a list of values already chosen in slots BEFORE this one
    const alreadyChosen = [
      slot > 1 ? this.shift1 : '',
      slot > 2 ? this.shift2 : '',
    ].filter(Boolean); // remove empty strings

    return this.shifts.filter(s => !alreadyChosen.includes(s.value));
  }

  // ── clearDuplicates(changedSlot) ──────────────────────────────────────────
  clearDuplicates(changedSlot: number): void {
    if (changedSlot <= 1 && this.shift2 === this.shift1) {
      this.shift2 = '';
    }
    if (this.shift3 === this.shift1 || this.shift3 === this.shift2) {
      this.shift3 = '';
    }
  }

  // ── shiftLabel(value) ─────────────────────────────────────────────────────
  // Helper that turns a shift value like 'A' into its full label string.
  // Used when building the comments payload so the admin sees readable text.
  private shiftLabel(value: string): string {
    return this.shifts.find(s => s.value === value)?.label ?? value;
  }

  // ── submit(form) ──────────────────────────────────────────────────────────
  submit(form: NgForm): void {
    this.submitted  = true;
    this.shiftError = '';
    this.errorMsg   = '';
    this.success    = false;

    // Check standard form fields first so those errors show properly
    if (form.invalid) return;

    // Check top 3 shift slots are filled
    const chosen = [this.shift1, this.shift2, this.shift3];
    if (chosen.some(s => !s)) {
      this.shiftError = 'Please rank your top 3 shift preferences before submitting.';
      return;
    }

    // Extra safety: no duplicates
    if (new Set(chosen).size < 3) {
      this.shiftError = 'Each shift choice must be different. Please review your selections.';
      return;
    }

    this.loading = true;

    // Format shift preferences as readable text.
    // Because the Attendee model stores a single `comments` field, we prepend
    // the shift rankings there. The admin attendee list will show the full text.
    const shiftSummary =
      `Shift Preferences (Top 3) — ` +
      `1st (Priority): ${this.shiftLabel(this.shift1)} | ` +
      `2nd: ${this.shiftLabel(this.shift2)} | ` +
      `3rd: ${this.shiftLabel(this.shift3)}`;

    const fullComments = this.comments
      ? `${shiftSummary}\n\nAdditional Comments: ${this.comments}`
      : shiftSummary;

    const payload = {
      name:         this.fullName,
      email:        this.email,
      phone:        this.phone,
      dob:          this.dob,
      education:    '',
      county:       this.county,
      trainingType: 'Shipyard Welding',
      heardFrom:    this.heardFrom,
      heardOther:   this.heardOther,
      comments:     fullComments,
      eventId:      'shipyard-welding-orientation-2026-06-08',
    };

    this.attendeesSvc.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        form.resetForm();
        // Manually clear shift fields since ngForm.resetForm() won't know about them
        this.shift1 = this.shift2 = this.shift3 = '';
        this.submitted = false;
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
