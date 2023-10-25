/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceBilling } from './ServiceBilling.service';

describe('Service: ServiceBilling', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceBilling]
    });
  });

  it('should ...', inject([ServiceBilling], (service: ServiceBilling) => {
    expect(service).toBeTruthy();
  }));
});
