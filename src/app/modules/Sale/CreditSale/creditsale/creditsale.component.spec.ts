import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsaleComponent } from './creditsale.component';

describe('CreditsaleComponent', () => {
  let component: CreditsaleComponent;
  let fixture: ComponentFixture<CreditsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
