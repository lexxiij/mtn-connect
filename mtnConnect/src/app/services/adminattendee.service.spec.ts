import { TestBed } from '@angular/core/testing';

import { AdminattendeeService } from './adminattendee.service';

describe('AdminattendeeService', () => {
  let service: AdminattendeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminattendeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
