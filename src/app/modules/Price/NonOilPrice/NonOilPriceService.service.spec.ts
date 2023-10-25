/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NonOilPriceService } from './NonOilPriceService.service';

describe('Service: NonOilPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NonOilPriceService]
    });
  });

  it('should ...', inject([NonOilPriceService], (service: NonOilPriceService) => {
    expect(service).toBeTruthy();
  }));
});
