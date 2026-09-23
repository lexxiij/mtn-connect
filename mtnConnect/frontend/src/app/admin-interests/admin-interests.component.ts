// admin-interests.component.ts
// Admin-only list of interest-form sign-ups (route: /interests).

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Interest } from '../models/interest.model';
import { InterestsService } from '../services/interests.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-interests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-interests.component.html',
  // Reuse the attendee list's table/header styles so admin pages match.
  styleUrl: '../adminattendee-list/adminattendee-list.component.css',
})
export class AdminInterestsComponent implements OnInit {
  interests: Interest[] = [];
  loading  = false;
  errorMsg = '';

  constructor(
    private svc: InterestsService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading  = true;
    this.errorMsg = '';
    this.svc.getAll().subscribe({
      next: (data) => { this.interests = data; this.loading = false; },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to load interest sign-ups.';
        this.loading  = false;
      },
    });
  }

  // Quick counts per class, e.g. { Forklift: 12, CDL: 5 } — handy after a job fair.
  get countsByClass(): { name: string; count: number }[] {
    const counts: { [k: string]: number } = {};
    for (const i of this.interests) {
      counts[i.trainingType] = (counts[i.trainingType] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  remove(i: Interest): void {
    if (!i._id) return;
    if (!confirm(`Delete ${i.name}'s sign-up?`)) return;
    this.svc.delete(i._id).subscribe({
      next: () => this.interests = this.interests.filter(x => x._id !== i._id),
      error: (err) => this.errorMsg = err.error?.message || 'Delete failed.',
    });
  }

  exportCSV(): void {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'County', 'Date of Birth',
                     'Education', 'Class', 'Comments', 'Source', 'Signed Up'];
    const escape = (val: any) => `"${(val == null ? '' : String(val)).replace(/"/g, '""')}"`;

    const rows = [headers.map(escape).join(',')];
    for (const i of this.interests) {
      rows.push([
        i.name, i.email, i.phone, i.address, i.county, i.dob, i.education,
        i.trainingType, i.comments, i.source,
        i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '',
      ].map(escape).join(','));
    }

    const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interest-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
