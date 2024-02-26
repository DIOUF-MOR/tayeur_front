/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewTayeurComponent } from './new-tayeur.component';

describe('NewTayeurComponent', () => {
  let component: NewTayeurComponent;
  let fixture: ComponentFixture<NewTayeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTayeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTayeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
