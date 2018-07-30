import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuestionAnswersComponent } from './view-question-answers.component';

describe('ViewQuestionAnswersComponent', () => {
  let component: ViewQuestionAnswersComponent;
  let fixture: ComponentFixture<ViewQuestionAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuestionAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuestionAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
