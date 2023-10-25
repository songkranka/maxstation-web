/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LangService } from './Lang.service';

describe('Service: Lang', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LangService]
    });
  });

  it('should ...', inject([LangService], (service: LangService) => {
    expect(service).toBeTruthy();
  }));
});
