import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEducationalCreateComponent } from './model-educational-create.component';

describe('ModelEducationalCreateComponent', () => {
  let component: ModelEducationalCreateComponent;
  let fixture: ComponentFixture<ModelEducationalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelEducationalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelEducationalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
