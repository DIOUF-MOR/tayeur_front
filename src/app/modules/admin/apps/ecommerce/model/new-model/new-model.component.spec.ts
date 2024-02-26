/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewModelComponent } from './new-model.component';

describe('NewModelComponent', () => {
  let component: NewModelComponent;
  let fixture: ComponentFixture<NewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
