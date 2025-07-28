import { TestBed } from '@angular/core/testing';

import { AllocationHistoryService } from './allocation-history.service';

describe('AllocationHistoryService', () => {
  let service: AllocationHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllocationHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
