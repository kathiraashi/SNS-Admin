import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelUserManagementEditComponent } from './model-user-management-edit.component';

describe('ModelUserManagementEditComponent', () => {
  let component: ModelUserManagementEditComponent;
  let fixture: ComponentFixture<ModelUserManagementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelUserManagementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelUserManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
