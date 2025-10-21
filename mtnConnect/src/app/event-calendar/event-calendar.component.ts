import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './event-calendar.component.html',
})
export class CalendarComponent {
  currentDate = new Date();

  year(): number {
    return this.currentDate.getFullYear();
  }

  monthIndex(): number {
    return this.currentDate.getMonth();
  }

  prevMonth(): void {
    const prev = new Date(this.year(), this.monthIndex() - 1, 1);
    this.currentDate = prev;
  }

  nextMonth(): void {
    const next = new Date(this.year(), this.monthIndex() + 1, 1);
    this.currentDate = next;
  }

  get emptyStartDays(): undefined[] {
    const firstDayOfMonth = new Date(this.year(), this.monthIndex(), 1).getDay();
    return Array(firstDayOfMonth).fill(undefined);
  }

calendar(): Date[] {
    const year = this.year();
    const month = this.monthIndex();

    const days: Date[] = [];
    const totalDays = new Date(year, month + 1, 0).getDate(); // Last day of the month

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  // Handle date click
  onDateClick(date: Date): void {
    console.log('Selected date:', date);
  }
}



