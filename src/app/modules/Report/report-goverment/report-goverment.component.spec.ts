import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGovermentComponent } from './report-goverment.component';

describe('ReportGovermentComponent', () => {
  let component: ReportGovermentComponent;
  let fixture: ComponentFixture<ReportGovermentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportGovermentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGovermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
