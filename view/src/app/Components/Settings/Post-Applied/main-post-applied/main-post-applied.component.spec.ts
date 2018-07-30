import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPostAppliedComponent } from './main-post-applied.component';

describe('MainPostAppliedComponent', () => {
  let component: MainPostAppliedComponent;
  let fixture: ComponentFixture<MainPostAppliedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPostAppliedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPostAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
