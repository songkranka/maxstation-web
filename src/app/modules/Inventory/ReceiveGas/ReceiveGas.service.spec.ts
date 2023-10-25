/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReceiveGasService } from './ReceiveGas.service';

describe('Service: ReceiveGas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiveGasService]
    });
  });

  it('should ...', inject([ReceiveGasService], (service: ReceiveGasService) => {
    expect(service).toBeTruthy();
  }));
});
