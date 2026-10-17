import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsEditComponent } from './tips-edit.component';

describe('TipsEditComponent', () => {
  let component: TipsEditComponent;
  let fixture: ComponentFixture<TipsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
