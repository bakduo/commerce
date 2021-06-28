import { TestBed } from '@angular/core/testing';

import { ControlauthService } from './controlauth.service';

describe('ControlauthService', () => {
  let service: ControlauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
