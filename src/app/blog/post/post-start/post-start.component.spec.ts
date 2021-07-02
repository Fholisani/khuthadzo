import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostStartComponent } from './post-start.component';

describe('PostStartComponent', () => {
  let component: PostStartComponent;
  let fixture: ComponentFixture<PostStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
