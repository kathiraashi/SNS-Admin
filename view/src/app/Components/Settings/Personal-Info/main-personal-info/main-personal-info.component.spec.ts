import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPersonalInfoComponent } from './main-personal-info.component';

describe('MainPersonalInfoComponent', () => {
  let component: MainPersonalInfoComponent;
  let fixture: ComponentFixture<MainPersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPersonalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
