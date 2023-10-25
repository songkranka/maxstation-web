import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRequestListComponent } from './AdjustRequestList.component';

describe('AdjustRequestListComponent', () => {
  let component: AdjustRequestListComponent;
  let fixture: ComponentFixture<AdjustRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
