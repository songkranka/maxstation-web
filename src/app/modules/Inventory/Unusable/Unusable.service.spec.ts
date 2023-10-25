/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnusableService } from './Unusable.service';

describe('Service: Unusable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnusableService]
    });
  });

  it('should ...', inject([UnusableService], (service: UnusableService) => {
    expect(service).toBeTruthy();
  }));
});
