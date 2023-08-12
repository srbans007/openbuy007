import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoRutaComponent } from './tipo-ruta.component';

describe('TipoRutaComponent', () => {
  let component: TipoRutaComponent;
  let fixture: ComponentFixture<TipoRutaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoRutaComponent]
    });
    fixture = TestBed.createComponent(TipoRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
