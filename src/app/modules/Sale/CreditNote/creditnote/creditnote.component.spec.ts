import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnoteComponent } from './creditnote.component';

describe('CreditnoteComponent', () => {
  let component: CreditnoteComponent;
  let fixture: ComponentFixture<CreditnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
