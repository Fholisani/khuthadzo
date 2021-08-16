import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPtComponent } from './post-pt.component';

describe('PostPtComponent', () => {
  let component: PostPtComponent;
  let fixture: ComponentFixture<PostPtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
