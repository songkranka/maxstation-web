/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExcelReaderService } from './ExcelReader.service';

describe('Service: ExcelReader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcelReaderService]
    });
  });

  it('should ...', inject([ExcelReaderService], (service: ExcelReaderService) => {
    expect(service).toBeTruthy();
  }));
});
