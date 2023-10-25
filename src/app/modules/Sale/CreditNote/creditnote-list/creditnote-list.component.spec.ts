import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnoteListComponent } from './creditnote-list.component';

describe('CreditnoteListComponent', () => {
  let component: CreditnoteListComponent;
  let fixture: ComponentFixture<CreditnoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditnoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditnoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
