import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosListComponent } from './terminos-list.component';

describe('TerminosListComponent', () => {
  let component: TerminosListComponent;
  let fixture: ComponentFixture<TerminosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
