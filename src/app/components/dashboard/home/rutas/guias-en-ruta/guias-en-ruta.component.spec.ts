import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiasEnRutaComponent } from './guias-en-ruta.component';

describe('GuiasEnRutaComponent', () => {
  let component: GuiasEnRutaComponent;
  let fixture: ComponentFixture<GuiasEnRutaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuiasEnRutaComponent]
    });
    fixture = TestBed.createComponent(GuiasEnRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
