import { TestBed } from '@angular/core/testing';

import { MessageclientService } from './messageclient.service';

describe('MessageclientService', () => {
  let service: MessageclientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageclientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
