import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCategoryCreateComponent } from './model-category-create.component';

describe('ModelCategoryCreateComponent', () => {
  let component: ModelCategoryCreateComponent;
  let fixture: ComponentFixture<ModelCategoryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCategoryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
