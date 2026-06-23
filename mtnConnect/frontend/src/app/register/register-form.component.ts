import { Component, OnInit } from "@angular/core";
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAttendeesService } from '../services/admin-attendees.service';
import { EventsService, TrainingEvent } from '../services/events.service';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegistrationFormComponent implements OnInit {
  firstName    = '';
  lastName     = '';
  email        = '';
  phone        = '';
  address      = '';
  dob          = '';
  education    = '';
  county       = '';
  trainingType = '';
  heardFrom    = '';
  heardOther   = '';
  comments     = '';
  submitted        = false;
  success          = false;
  loading          = false;
  errorMsg         = '';
  submittedType    = '';
  submittedDate    = '';   // orientation date for the success modal
  addressError     = '';

  // Map of trainingType (lowercase) → event date "YYYY-MM-DD"
  // Populated on load so the success modal can show the right date.
  private eventDateMap: { [type: string]: string } = {};

  public missouriCounties: string[] = [
    'Mississippi', 'Scott', 'New Madrid', 'Pemiscot', 'Butler',
    'Bollinger', 'Dunklin', 'Cape Girardeau', 'Perry',
    'Saint Francois', 'Stoddard', 'Saint Genevieve',
  ];

  constructor(
    private attendeesSvc: AdminAttendeesService,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    // Fetch events once so we can look up the orientation date after submit.
    this.eventsService.getAll().subscribe({
      next: (events: TrainingEvent[]) => {
        // Build a quick-lookup map: "cdl" → "2026-07-15", "forklift" → "2026-08-01", etc.
        // If the same type has multiple events, the soonest UPCOMING date wins.
        const today = new Date().toISOString().split('T')[0];
        for (const e of events) {
          if (!e.trainingType || !e.date) continue;
          // Skip events that have already happened — only upcoming dates
          // should ever end up in the map. (Previously a past event could
          // get stored first and then never get replaced by a real upcoming
          // date, which is why CDL was stuck showing a date that had passed.)
          if (e.date < today) continue;

          const key = e.trainingType.toLowerCase();
          if (!this.eventDateMap[key] || e.date < this.eventDateMap[key]) {
            this.eventDateMap[key] = e.date;
          }
        }
      },
      error: () => { /* silent — date just won't show in modal */ }
    });
  }

  submit(form: NgForm) {
    this.submitted    = true;
    this.success      = false;
    this.errorMsg     = '';
    this.addressError = '';

    if (form.invalid) return;

    // Require a 5-digit ZIP somewhere in the address string.
    // This is a simple way to confirm the person included city, state, and zip.
    if (!this.address.trim()) {
      this.addressError = 'Address is required.';
      return;
    }
    if (!/\d{5}/.test(this.address)) {
      this.addressError = 'Please include your full address: Street, City, State, and ZIP code.';
      return;
    }

    this.loading = true;

    const payload = {
      // Backend only stores a single "name" field, so join the two here.
      name:         `${this.firstName.trim()} ${this.lastName.trim()}`.trim(),
      email:        this.email,
      phone:        this.phone,
      address:      this.address,
      dob:          this.dob,
      education:    this.education,
      county:       this.county,
      trainingType: this.trainingType,
      heardFrom:    this.heardFrom,
      heardOther:   this.heardOther,
      comments:     this.comments,
    };

    this.attendeesSvc.create(payload).subscribe({
      next: () => {
        this.loading       = false;
        this.submittedType = this.trainingType;
        // Look up the orientation date for whichever training type they chose
        this.submittedDate = this.eventDateMap[this.trainingType.toLowerCase()] || '';
        this.success       = true;
        form.resetForm();
        this.submitted     = false;
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
