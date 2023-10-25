/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuditService } from './Audit.service';

describe('Service: Audit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditService]
    });
  });

  it('should ...', inject([AuditService], (service: AuditService) => {
    expect(service).toBeTruthy();
  }));
});
