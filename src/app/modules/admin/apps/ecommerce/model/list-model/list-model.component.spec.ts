/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListModelComponent } from './list-model.component';

describe('ListModelComponent', () => {
  let component: ListModelComponent;
  let fixture: ComponentFixture<ListModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
