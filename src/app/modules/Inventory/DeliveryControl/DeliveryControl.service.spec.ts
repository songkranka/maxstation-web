/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeliveryControlService } from './DeliveryControl.service';

describe('Service: DeliveryControl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryControlService]
    });
  });

  it('should ...', inject([DeliveryControlService], (service: DeliveryControlService) => {
    expect(service).toBeTruthy();
  }));
});
