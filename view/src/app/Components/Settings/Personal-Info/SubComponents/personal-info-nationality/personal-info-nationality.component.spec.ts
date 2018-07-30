import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoNationalityComponent } from './personal-info-nationality.component';

describe('PersonalInfoNationalityComponent', () => {
  let component: PersonalInfoNationalityComponent;
  let fixture: ComponentFixture<PersonalInfoNationalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInfoNationalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
