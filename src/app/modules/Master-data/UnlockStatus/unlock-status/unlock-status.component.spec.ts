import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockStatusComponent } from './unlock-status.component';

describe('UnlockStatusComponent', () => {
  let component: UnlockStatusComponent;
  let fixture: ComponentFixture<UnlockStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
