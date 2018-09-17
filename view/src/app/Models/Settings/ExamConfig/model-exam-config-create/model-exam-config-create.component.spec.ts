import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelExamConfigCreateComponent } from './model-exam-config-create.component';

describe('ModelExamConfigCreateComponent', () => {
  let component: ModelExamConfigCreateComponent;
  let fixture: ComponentFixture<ModelExamConfigCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelExamConfigCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelExamConfigCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
