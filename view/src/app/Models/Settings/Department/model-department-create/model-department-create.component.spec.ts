import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDepartmentCreateComponent } from './model-department-create.component';

describe('ModelDepartmentCreateComponent', () => {
  let component: ModelDepartmentCreateComponent;
  let fixture: ComponentFixture<ModelDepartmentCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDepartmentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDepartmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
