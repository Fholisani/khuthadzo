import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandDrawingComponent } from './hand-drawing.component';

describe('HandDrawingComponent', () => {
  let component: HandDrawingComponent;
  let fixture: ComponentFixture<HandDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
