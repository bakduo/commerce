import { TestBed } from '@angular/core/testing';

import { ControlRoutesGuard } from './control-routes.guard';

describe('ControlRoutesGuard', () => {
  let guard: ControlRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ControlRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
