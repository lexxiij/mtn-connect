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
  dob          = '';
  education    = '';
  county       = '';
  trainingType = '';
  heardFrom    = '';
  heardOther   = '';
  comments     = '';
  submitted    = false;
  success      = false;
  loading      = false;
  errorMsg     = '';

  public missouriCounties: string[] = [
    'Mississippi', 'Scott', 'New Madrid', 'Pemiscot', 'Butler',
    'Bollinger', 'Dunklin', 'Cape Girardeau', 'Perry',
    'Saint Francois', 'Stoddard', 'Saint Genevieve',
  ];

  constructor(private attendeesSvc: AdminAttendeesService) {}

  submit(form: NgForm) {
    this.submitted = true;
    this.success   = false;
    this.errorMsg  = '';

    if (form.invalid) return;

    this.loading = true;

    const payload = {
      name:         this.fullName,
      email:        this.email,
      phone:        this.phone,
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
        this.loading = false;
        this.success = true;
        form.resetForm();
        this.submitted = false;
      },
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
