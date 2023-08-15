import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuiasRutaComponent } from './modal-guias-ruta.component';

describe('ModalGuiasRutaComponent', () => {
  let component: ModalGuiasRutaComponent;
  let fixture: ComponentFixture<ModalGuiasRutaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGuiasRutaComponent]
    });
    fixture = TestBed.createComponent(ModalGuiasRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
