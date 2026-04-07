// login/login.component.ts
// Simple admin login form that calls AuthService.login()

import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username  = '';
  password  = '';
  submitted = false;
  loading   = false;
  errorMsg  = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(form: NgForm) {
    this.submitted = true;
    this.errorMsg  = '';

    if (form.invalid) return;

    this.loading = true;

    // auth.login() returns an Observable — we must subscribe() to trigger the HTTP call.
    // subscribe({ next, error }) handles success and failure separately.
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        // On success, navigate to the admin attendee list
        this.router.navigate(['/attendees']);
      },
      error: (err) => {
        this.loading = false;
        // err.error.message comes from our Express route's res.json({ message: '...' })
        this.errorMsg = err.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
