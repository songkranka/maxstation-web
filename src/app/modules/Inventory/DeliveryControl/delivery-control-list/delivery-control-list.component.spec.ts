import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryControlListComponent } from './delivery-control-list.component';

describe('DeliveryControlListComponent', () => {
  let component: DeliveryControlListComponent;
  let fixture: ComponentFixture<DeliveryControlListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryControlListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryControlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
