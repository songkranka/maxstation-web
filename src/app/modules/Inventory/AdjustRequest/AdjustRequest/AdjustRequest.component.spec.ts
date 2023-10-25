import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRequestComponent } from './AdjustRequest.component';

describe('AdjustRequestComponent', () => {
  let component: AdjustRequestComponent;
  let fixture: ComponentFixture<AdjustRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
