import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInstitutionCreateComponent } from './model-institution-create.component';

describe('ModelInstitutionCreateComponent', () => {
  let component: ModelInstitutionCreateComponent;
  let fixture: ComponentFixture<ModelInstitutionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelInstitutionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelInstitutionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
