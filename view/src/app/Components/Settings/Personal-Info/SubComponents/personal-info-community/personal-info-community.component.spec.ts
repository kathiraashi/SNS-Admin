import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoCommunityComponent } from './personal-info-community.component';

describe('PersonalInfoCommunityComponent', () => {
  let component: PersonalInfoCommunityComponent;
  let fixture: ComponentFixture<PersonalInfoCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInfoCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
