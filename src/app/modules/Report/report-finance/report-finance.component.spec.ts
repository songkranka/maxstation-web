import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFinanceComponent } from './report-finance.component';

describe('ReportFinanceComponent', () => {
  let component: ReportFinanceComponent;
  let fixture: ComponentFixture<ReportFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFinanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
