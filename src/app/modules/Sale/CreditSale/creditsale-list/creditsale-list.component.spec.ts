import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsaleListComponent } from './creditsale-list.component';

describe('CreditsaleListComponent', () => {
  let component: CreditsaleListComponent;
  let fixture: ComponentFixture<CreditsaleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsaleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
