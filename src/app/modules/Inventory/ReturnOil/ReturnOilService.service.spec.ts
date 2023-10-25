/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReturnOilService } from './ReturnOilService.service';

describe('Service: ReturnOilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReturnOilService]
    });
  });

  it('should ...', inject([ReturnOilService], (service: ReturnOilService) => {
    expect(service).toBeTruthy();
  }));
});
