import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummarySaleComponent } from './ReportSummarySale.component';

describe('ReportSummarySaleComponent', () => {
  let component: ReportSummarySaleComponent;
  let fixture: ComponentFixture<ReportSummarySaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSummarySaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummarySaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
