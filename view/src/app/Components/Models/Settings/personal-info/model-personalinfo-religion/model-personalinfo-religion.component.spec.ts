import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPersonalinfoReligionComponent } from './model-personalinfo-religion.component';

describe('ModelPersonalinfoReligionComponent', () => {
  let component: ModelPersonalinfoReligionComponent;
  let fixture: ComponentFixture<ModelPersonalinfoReligionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPersonalinfoReligionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPersonalinfoReligionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
