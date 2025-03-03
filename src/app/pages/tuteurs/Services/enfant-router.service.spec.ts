import { TestBed } from '@angular/core/testing';

import { EnfantRouterService } from './enfant-router.service';

describe('EnfantRouterService', () => {
  let service: EnfantRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnfantRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
