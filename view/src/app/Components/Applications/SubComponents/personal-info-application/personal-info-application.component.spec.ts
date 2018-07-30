import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoApplicationComponent } from './personal-info-application.component';

describe('PersonalInfoApplicationComponent', () => {
  let component: PersonalInfoApplicationComponent;
  let fixture: ComponentFixture<PersonalInfoApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInfoApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
