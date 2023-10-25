import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTransferInComponent } from './SupplyTransferIn.component';

describe('SupplyTransferInComponent', () => {
  let component: SupplyTransferInComponent;
  let fixture: ComponentFixture<SupplyTransferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyTransferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
