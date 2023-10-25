import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTransferInListComponent } from './SupplyTransferInList.component';

describe('SupplyTransferInListComponent', () => {
  let component: SupplyTransferInListComponent;
  let fixture: ComponentFixture<SupplyTransferInListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyTransferInListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyTransferInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
