import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDeclarationApplicationComponent } from './reference-declaration-application.component';

describe('ReferenceDeclarationApplicationComponent', () => {
  let component: ReferenceDeclarationApplicationComponent;
  let fixture: ComponentFixture<ReferenceDeclarationApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDeclarationApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDeclarationApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
