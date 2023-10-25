import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMeterComponent } from './report-meter.component';

describe('ReportMeterComponent', () => {
  let component: ReportMeterComponent;
  let fixture: ComponentFixture<ReportMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMeterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
