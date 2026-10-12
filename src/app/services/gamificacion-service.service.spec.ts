import { TestBed } from '@angular/core/testing';

import { GamificacionService } from './gamificacion.service';

describe('GamificacionService', () => {
  let service: GamificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
