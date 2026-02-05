import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { attendee } from '../models/attendee.model';

interface Attendee {
  name: string;
  email: string;
  phone: string;
  county: string;
  trainingType: string;
  heardFrom: string;
  comments: string;
}

@Component({
  selector: 'app-attendee-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './adminattendee-list.component.html',
  styleUrl: './adminattendee-list.component.css'
})
export class AttendeeListComponent {
  attendees: Attendee[] = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      county: 'Scott',
      trainingType: 'CDL',
      heardFrom: 'Friend',
      comments: '',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      county: 'Cape Girardeau',
      trainingType: 'Forklift',
      heardFrom: 'Social Media',
      comments: '',
    },
  ];
  editingIndex: number | null = null;
  newAttendee: Attendee = {
    name: '',
    email: '',
    phone: '',
    county: '',
    trainingType: '',
    heardFrom: '',
    comments: '',
  };

  add(form: NgForm) {
    if (form.invalid) return;
    this.attendees.push({...this.newAttendee });
    form.resetForm();
  }
  edit(attendee: Attendee, index: number) {
    this.editingIndex = index;
    this.newAttendee = { ...attendee };
  }
  update(form: NgForm) {
    if (this.editingIndex === null || form.invalid) return;
    this.attendees[this.editingIndex] = { ...this.newAttendee}
  }
  delete(attendee: Attendee) { }
}
