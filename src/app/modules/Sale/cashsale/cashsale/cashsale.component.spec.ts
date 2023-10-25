import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashsaleComponent } from './cashsale.component';

describe('CashsaleComponent', () => {
  let component: CashsaleComponent;
  let fixture: ComponentFixture<CashsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
