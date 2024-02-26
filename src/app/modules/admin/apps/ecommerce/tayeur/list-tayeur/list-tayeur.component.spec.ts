/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListTayeurComponent } from './list-tayeur.component';

describe('ListTayeurComponent', () => {
  let component: ListTayeurComponent;
  let fixture: ComponentFixture<ListTayeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTayeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTayeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
