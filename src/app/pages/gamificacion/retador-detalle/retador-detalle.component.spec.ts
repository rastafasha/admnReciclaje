import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetadorDetalleComponent } from './retador-detalle.component';

describe('RetadorDetalleComponent', () => {
  let component: RetadorDetalleComponent;
  let fixture: ComponentFixture<RetadorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetadorDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
