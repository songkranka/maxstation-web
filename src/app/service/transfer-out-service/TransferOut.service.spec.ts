/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransferOutService } from './TransferOut.service';

describe('Service: TransferOut', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferOutService]
    });
  });

  it('should ...', inject([TransferOutService], (service: TransferOutService) => {
    expect(service).toBeTruthy();
  }));
});
