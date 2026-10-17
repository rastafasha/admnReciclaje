import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosEditComponent } from './terminos-edit.component';

describe('TerminosEditComponent', () => {
  let component: TerminosEditComponent;
  let fixture: ComponentFixture<TerminosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
