/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BranchMasterService } from './branch-master-service';

describe('Service: TransferIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchMasterService]
    });
  });

  it('should ...', inject([BranchMasterService], (service: BranchMasterService) => {
    expect(service).toBeTruthy();
  }));
});