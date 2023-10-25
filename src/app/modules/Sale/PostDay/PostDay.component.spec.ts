import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDayComponent } from './PostDay.component';

describe('PostDayComponent', () => {
  let component: PostDayComponent;
  let fixture: ComponentFixture<PostDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
