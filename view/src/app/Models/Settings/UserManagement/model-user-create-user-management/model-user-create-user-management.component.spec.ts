import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelUserCreateUserManagementComponent } from './model-user-create-user-management.component';

describe('ModelUserCreateUserManagementComponent', () => {
  let component: ModelUserCreateUserManagementComponent;
  let fixture: ComponentFixture<ModelUserCreateUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelUserCreateUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelUserCreateUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
