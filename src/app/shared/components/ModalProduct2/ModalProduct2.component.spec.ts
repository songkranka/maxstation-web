/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalProduct2Component } from './ModalProduct2.component';

describe('ModalProduct2Component', () => {
  let component: ModalProduct2Component;
  let fixture: ComponentFixture<ModalProduct2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProduct2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProduct2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
