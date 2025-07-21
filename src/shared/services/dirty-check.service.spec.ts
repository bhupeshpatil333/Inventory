import { TestBed } from '@angular/core/testing';

import { DirtyCheckService } from './dirty-check.service';

describe('DirtyCheckService', () => {
  let service: DirtyCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirtyCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
