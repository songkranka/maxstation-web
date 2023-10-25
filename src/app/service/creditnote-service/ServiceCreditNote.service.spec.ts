/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceCreditNote } from './ServiceCreditNote.service';

describe('Service: ServiceCreditNote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceCreditNote]
    });
  });

  it('should ...', inject([ServiceCreditNote], (service: ServiceCreditNote) => {
    expect(service).toBeTruthy();
  }));
});
