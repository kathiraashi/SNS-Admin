import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceActivitiesApplicationComponent } from './experience-activities-application.component';

describe('ExperienceActivitiesApplicationComponent', () => {
  let component: ExperienceActivitiesApplicationComponent;
  let fixture: ComponentFixture<ExperienceActivitiesApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceActivitiesApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceActivitiesApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
