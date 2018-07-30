import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEducationalInfoComponent } from './main-educational-info.component';

describe('MainEducationalInfoComponent', () => {
  let component: MainEducationalInfoComponent;
  let fixture: ComponentFixture<MainEducationalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainEducationalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEducationalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
