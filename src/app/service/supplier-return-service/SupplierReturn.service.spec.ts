/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupplierReturnService } from './SupplierReturn.service';

describe('Service: TransferIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierReturnService]
    });
  });

  it('should ...', inject([SupplierReturnService], (service: SupplierReturnService) => {
    expect(service).toBeTruthy();
  }));
});