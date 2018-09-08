import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelExcelUploadsViewComponent } from './model-excel-uploads-view.component';

describe('ModelExcelUploadsViewComponent', () => {
  let component: ModelExcelUploadsViewComponent;
  let fixture: ComponentFixture<ModelExcelUploadsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelExcelUploadsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelExcelUploadsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
