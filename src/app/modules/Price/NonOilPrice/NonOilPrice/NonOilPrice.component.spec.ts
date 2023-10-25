/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NonOilPriceComponent } from './NonOilPrice.component';

describe('NonOilPriceComponent', () => {
  let component: NonOilPriceComponent;
  let fixture: ComponentFixture<NonOilPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonOilPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonOilPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
