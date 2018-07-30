import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEditQuestionAnswersComponent } from './model-edit-question-answers.component';

describe('ModelEditQuestionAnswersComponent', () => {
  let component: ModelEditQuestionAnswersComponent;
  let fixture: ComponentFixture<ModelEditQuestionAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelEditQuestionAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelEditQuestionAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
