import { TestBed } from '@angular/core/testing';

import { AdminAttendeesService } from './admin-attendees.service';

describe('AdminAttendeesService', () => {
  let service: AdminAttendeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAttendeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
