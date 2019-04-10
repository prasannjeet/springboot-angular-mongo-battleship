import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Battleboard2Component } from './battleboard2.component';

describe('Battleboard2Component', () => {
  let component: Battleboard2Component;
  let fixture: ComponentFixture<Battleboard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Battleboard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Battleboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
