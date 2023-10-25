/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceInvoice } from './ServiceInvoice.service';

describe('Service: ServiceInvoice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceInvoice]
    });
  });

  it('should ...', inject([ServiceInvoice], (service: ServiceInvoice) => {
    expect(service).toBeTruthy();
  }));
});
