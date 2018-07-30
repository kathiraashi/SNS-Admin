import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoApplicationComponent } from './basic-info-application.component';

describe('BasicInfoApplicationComponent', () => {
  let component: BasicInfoApplicationComponent;
  let fixture: ComponentFixture<BasicInfoApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
