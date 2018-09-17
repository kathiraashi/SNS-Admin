import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamConfigListComponent } from './exam-config-list.component';

describe('ExamConfigListComponent', () => {
  let component: ExamConfigListComponent;
  let fixture: ComponentFixture<ExamConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
