import { TestBed } from '@angular/core/testing';

import { MessagesDisplayService } from './messages-display.service';

describe('MessagesDisplayService', () => {
  let service: MessagesDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
