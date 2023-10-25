import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCustomerComponent } from './report-customer.component';

describe('ReportCustomerComponent', () => {
  let component: ReportCustomerComponent;
  let fixture: ComponentFixture<ReportCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
