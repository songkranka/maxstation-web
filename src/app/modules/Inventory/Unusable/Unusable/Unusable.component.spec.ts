/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnusableComponent } from './Unusable.component';

describe('UnusableComponent', () => {
  let component: UnusableComponent;
  let fixture: ComponentFixture<UnusableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnusableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
