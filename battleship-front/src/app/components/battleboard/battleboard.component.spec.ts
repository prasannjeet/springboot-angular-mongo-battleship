import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleboardComponent } from './battleboard.component';

describe('BattleboardComponent', () => {
  let component: BattleboardComponent;
  let fixture: ComponentFixture<BattleboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
