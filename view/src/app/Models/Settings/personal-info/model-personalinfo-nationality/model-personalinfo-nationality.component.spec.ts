import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPersonalinfoNationalityComponent } from './model-personalinfo-nationality.component';

describe('ModelPersonalinfoNationalityComponent', () => {
  let component: ModelPersonalinfoNationalityComponent;
  let fixture: ComponentFixture<ModelPersonalinfoNationalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPersonalinfoNationalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPersonalinfoNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
