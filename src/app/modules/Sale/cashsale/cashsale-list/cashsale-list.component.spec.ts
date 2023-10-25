import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashsaleListComponent } from './cashsale-list.component';

describe('CashsaleListComponent', () => {
  let component: CashsaleListComponent;
  let fixture: ComponentFixture<CashsaleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashsaleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashsaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
