import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductGroupComponent } from './modal-product-group.component';

describe('ModalProductGroupComponent', () => {
  let component: ModalProductGroupComponent;
  let fixture: ComponentFixture<ModalProductGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProductGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
