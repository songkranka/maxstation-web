import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPTCorporateComponent } from './report-ptcorporate.component';

describe('ReportPTCorporateComponent', () => {
  let component: ReportPTCorporateComponent;
  let fixture: ComponentFixture<ReportPTCorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPTCorporateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPTCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
