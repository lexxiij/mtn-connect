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
  fullName     = '';
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
        // Build a quick-lookup map: "cdl" → "2026-05-29", "forklift" → "2026-05-29", etc.
        // If the same type has multiple events, the soonest upcoming date wins.
        const today = new Date().toISOString().split('T')[0];
        for (const e of events) {
          if (!e.trainingType || !e.date) continue;
          const key = e.trainingType.toLowerCase();
          // Keep the nearest upcoming date for each type
          if (!this.eventDateMap[key] || (e.date >= today && e.date < (this.eventDateMap[key] || '9999'))) {
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
      name:         this.fullName,
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
