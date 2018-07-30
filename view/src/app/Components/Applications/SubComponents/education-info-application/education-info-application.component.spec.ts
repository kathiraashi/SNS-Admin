import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationInfoApplicationComponent } from './education-info-application.component';

describe('EducationInfoApplicationComponent', () => {
  let component: EducationInfoApplicationComponent;
  let fixture: ComponentFixture<EducationInfoApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationInfoApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationInfoApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
