import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTaxListComponent } from './branch-tax-list.component';

describe('BranchTaxListComponent', () => {
  let component: BranchTaxListComponent;
  let fixture: ComponentFixture<BranchTaxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTaxListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTaxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
