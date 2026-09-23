// interest-form.component.ts
// Public "I'm interested" form — built for job fairs.
// People pick ONE class they want to hear about and leave their contact info.
// Submissions go to /api/interests (a separate collection from registrations).

import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InterestsService } from '../services/interests.service';

@Component({
  selector: 'app-interest-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './interest-form.component.html',
  // Reuse the registration form's styles so both forms look the same,
  // then add a few extras in our own CSS file.
  styleUrls: [
    '../register/register-form.component.css',
    './interest-form.component.css',
  ],
})
export class InterestFormComponent implements OnInit {
  // ── Form fields (bound with [(ngModel)]) ──
  firstName    = '';
  lastName     = '';
  email        = '';
  phone        = '';
  address      = '';
  county       = '';
  dob          = '';
  education    = '';
  trainingType = '';
  comments     = '';

  // ── UI state ──
  submitted     = false;   // true after first submit click → shows all errors
  loading       = false;
  success       = false;
  errorMsg      = '';
  addressError  = '';
  submittedType = '';
  source        = '';      // filled from ?source=... in the URL (e.g. "job-fair")

  // Every class we offer. To add a new class later, just add it to this list.
  public classes: string[] = ['Forklift', 'CDL', 'Shipyard Welding'];

  public educationLevels: string[] = [
    'Some high school',
    'High school diploma / GED',
    'Some college',
    'Trade or technical certificate',
    "Associate's degree",
    "Bachelor's degree or higher",
  ];

  // Same list as the registration form, plus "Other" since job fairs
  // can draw people from outside our usual service area.
  public counties: string[] = [
    'Mississippi', 'Scott', 'New Madrid', 'Pemiscot', 'Butler',
    'Bollinger', 'Dunklin', 'Cape Girardeau', 'Perry',
    'Saint Francois', 'Stoddard', 'Saint Genevieve', 'Other',
  ];

  constructor(
    private interestsSvc: InterestsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Lets you track WHERE people came from. For example, the QR code at a
    // job fair can point to /interest?source=job-fair
    this.source = this.route.snapshot.queryParamMap.get('source') || '';
  }

  // Why not just form.resetForm()? It resets the form CONTROLS, but the
  // component properties bound with [(ngModel)] can keep their old values
  // (e.g. the chosen class stayed highlighted). Clearing them here is explicit.
  private clearFields(): void {
    this.firstName = this.lastName = this.email = this.phone = '';
    this.address = this.county = this.dob = this.education = '';
    this.trainingType = this.comments = '';
  }

  submit(form: NgForm): void {
    this.submitted    = true;
    this.errorMsg     = '';
    this.addressError = '';

    if (form.invalid) return;

    // Same ZIP check as the registration form: a 5-digit number
    // somewhere in the address means they likely typed the full address.
    if (!/\d{5}/.test(this.address)) {
      this.addressError = 'Please include your full address: Street, City, State, and ZIP code.';
      return;
    }

    this.loading = true;

    const payload = {
      name:         `${this.firstName.trim()} ${this.lastName.trim()}`.trim(),
      email:        this.email,
      phone:        this.phone,
      address:      this.address,
      county:       this.county,
      dob:          this.dob,
      education:    this.education,
      trainingType: this.trainingType,
      comments:     this.comments,
      source:       this.source,
    };

    this.interestsSvc.create(payload).subscribe({
      next: () => {
        this.loading       = false;
        this.submittedType = this.trainingType;
        this.success       = true;
        this.clearFields();        // ready for the next person in line
        form.resetForm();          // also resets touched/dirty state so errors don't show
        this.submitted     = false;
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
