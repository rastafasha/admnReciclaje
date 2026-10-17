import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaEditComponent } from './regla-edit.component';

describe('ReglaEditComponent', () => {
  let component: ReglaEditComponent;
  let fixture: ComponentFixture<ReglaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReglaEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReglaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
