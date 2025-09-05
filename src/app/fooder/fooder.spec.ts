import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fooder } from './fooder';

describe('Fooder', () => {
  let component: Fooder;
  let fixture: ComponentFixture<Fooder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Fooder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fooder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
