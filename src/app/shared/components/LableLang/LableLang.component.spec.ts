/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LableLangComponent } from './LableLang.component';

describe('LableLangComponent', () => {
  let component: LableLangComponent;
  let fixture: ComponentFixture<LableLangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LableLangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LableLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
