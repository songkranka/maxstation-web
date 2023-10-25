import { TestBed } from '@angular/core/testing';

import { NavigatorBarService } from './navigator-bar.service';

describe('NavigatorBarService', () => {
  let service: NavigatorBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigatorBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
