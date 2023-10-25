/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransferInService } from './TransferIn.service';

describe('Service: TransferIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferInService]
    });
  });

  it('should ...', inject([TransferInService], (service: TransferInService) => {
    expect(service).toBeTruthy();
  }));
});
