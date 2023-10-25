import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTankListComponent } from './branch-tank-list.component';

describe('BranchTankListComponent', () => {
  let component: BranchTankListComponent;
  let fixture: ComponentFixture<BranchTankListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTankListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
