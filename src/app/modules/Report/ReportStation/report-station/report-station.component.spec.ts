import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStationComponent } from './report-station.component';

describe('ReportStationComponent', () => {
  let component: ReportStationComponent;
  let fixture: ComponentFixture<ReportStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
