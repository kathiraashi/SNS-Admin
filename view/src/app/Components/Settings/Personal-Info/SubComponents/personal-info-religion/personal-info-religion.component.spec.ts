import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoReligionComponent } from './personal-info-religion.component';

describe('PersonalInfoReligionComponent', () => {
  let component: PersonalInfoReligionComponent;
  let fixture: ComponentFixture<PersonalInfoReligionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInfoReligionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoReligionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
