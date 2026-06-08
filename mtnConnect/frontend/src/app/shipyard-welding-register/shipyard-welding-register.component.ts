// Shipyard Welding orientation registration form.
// Extends the standard registration with a full class schedule display
// and a ranked shift-preference selector (Shifts A–D).

import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAttendeesService } from '../services/admin-attendees.service';
import { EventsService } from '../services/events.service';

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
export class ShipyardWeldingRegisterComponent implements OnInit {

  // ── Standard fields ────────────────────────────────────────────────────────
  fullName   = '';
  email      = '';
  phone      = '';
  address    = '';
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
  submitted          = false;
  success            = false;
  loading            = false;
  errorMsg           = '';
  addressError       = '';

  // ── Deadline check ─────────────────────────────────────────────────────────
  // Set to true while we fetch events to check the deadline on load.
  checkingDeadline   = true;
  // Set to true if today is past the admin-set registrationDeadline.
  registrationClosed = false;

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

  constructor(
    private attendeesSvc: AdminAttendeesService,
    private eventsService: EventsService,
  ) {}

  // ── ngOnInit ──────────────────────────────────────────────────────────────
  // Fetch events and check if registration for this Shipyard Welding cohort
  // is still open. If the admin has set a registrationDeadline and today is
  // past it, we lock the form and show a "Registration Closed" message.
  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    this.eventsService.getAll().subscribe({
      next: (events) => {
        // Find Shipyard Welding events sorted soonest-first
        const swEvents = events
          .filter(e => e.trainingType?.toLowerCase().includes('shipyard'))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Pick the most-relevant event: the next upcoming one, or the last one
        // if all dates have passed (so the deadline still applies).
        const target = swEvents.find(e => e.date >= today) ?? swEvents[swEvents.length - 1];

        if (target?.registrationDeadline) {
          // today > deadline  →  closed  (string comparison works for YYYY-MM-DD)
          this.registrationClosed = today > target.registrationDeadline;
        }

        this.checkingDeadline = false;
      },
      error: () => {
        // If events can't be loaded, fail open — still show the form.
        this.checkingDeadline = false;
      },
    });
  }

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
    this.submitted    = true;
    this.shiftError   = '';
    this.errorMsg     = '';
    this.addressError = '';
    this.success      = false;

    // Check standard form fields first so those errors show properly
    if (form.invalid) return;

    // Require a 5-digit ZIP somewhere in the address string.
    if (!this.address.trim()) {
      this.addressError = 'Address is required.';
      return;
    }
    if (!/\d{5}/.test(this.address)) {
      this.addressError = 'Please include your full address: Street, City, State, and ZIP code.';
      return;
    }

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
      address:      this.address,
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
