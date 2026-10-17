import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaIaComponent } from './auditoria-ia.component';

describe('AuditoriaIaComponent', () => {
  let component: AuditoriaIaComponent;
  let fixture: ComponentFixture<AuditoriaIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriaIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
