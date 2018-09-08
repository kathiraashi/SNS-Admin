import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPostCreateComponent } from './model-post-create.component';

describe('ModelPostCreateComponent', () => {
  let component: ModelPostCreateComponent;
  let fixture: ComponentFixture<ModelPostCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPostCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
