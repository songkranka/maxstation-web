/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CostCenterMasterService } from './costcenter-master-service';

describe('Service: TransferIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostCenterMasterService]
    });
  });

  it('should ...', inject([CostCenterMasterService], (service: CostCenterMasterService) => {
    expect(service).toBeTruthy();
  }));
});