import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetadorComponent } from './retador.component';

describe('RetadorComponent', () => {
  let component: RetadorComponent;
  let fixture: ComponentFixture<RetadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
