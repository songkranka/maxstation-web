import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryOilBalanceComponent } from './ReportSummaryOilBalance.component';

describe('ReportSummaryOilBalanceComponent', () => {
  let component: ReportSummaryOilBalanceComponent;
  let fixture: ComponentFixture<ReportSummaryOilBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSummaryOilBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryOilBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
