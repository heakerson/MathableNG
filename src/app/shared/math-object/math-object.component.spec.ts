import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathObjectComponent } from './math-object.component';

describe('MathObjectComponent', () => {
  let component: MathObjectComponent;
  let fixture: ComponentFixture<MathObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MathObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MathObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
