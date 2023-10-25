/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StandardPriceService } from './StandardPrice.service';

describe('Service: StandardPrice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardPriceService]
    });
  });

  it('should ...', inject([StandardPriceService], (service: StandardPriceService) => {
    expect(service).toBeTruthy();
  }));
});
