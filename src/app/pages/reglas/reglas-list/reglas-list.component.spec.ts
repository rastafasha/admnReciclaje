import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglasListComponent } from './reglas-list.component';

describe('ReglasListComponent', () => {
  let component: ReglasListComponent;
  let fixture: ComponentFixture<ReglasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReglasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReglasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
