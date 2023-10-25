import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTankComponent } from './branch-tank.component';

describe('BranchTankComponent', () => {
  let component: BranchTankComponent;
  let fixture: ComponentFixture<BranchTankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
