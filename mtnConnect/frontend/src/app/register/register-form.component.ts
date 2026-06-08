import { Component } from "@angular/core";
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAttendeesService } from '../services/admin-attendees.service';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegistrationFormComponent {
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
  addressError     = '';

  public missouriCounties: string[] = [
    'Mississippi', 'Scott', 'New Madrid', 'Pemiscot', 'Butler',
    'Bollinger', 'Dunklin', 'Cape Girardeau', 'Perry',
    'Saint Francois', 'Stoddard', 'Saint Genevieve',
  ];

  constructor(private attendeesSvc: AdminAttendeesService) {}

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
        this.loading      = false;
        this.submittedType = this.trainingType;
        this.success      = true;
        form.resetForm();
        this.submitted    = false;
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
