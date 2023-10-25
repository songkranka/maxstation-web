/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnusableListComponent } from './UnusableList.component';

describe('UnusableListComponent', () => {
  let component: UnusableListComponent;
  let fixture: ComponentFixture<UnusableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnusableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
