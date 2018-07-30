import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPersonalinfoCommunityComponent } from './model-personalinfo-community.component';

describe('ModelPersonalinfoCommunityComponent', () => {
  let component: ModelPersonalinfoCommunityComponent;
  let fixture: ComponentFixture<ModelPersonalinfoCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPersonalinfoCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPersonalinfoCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
