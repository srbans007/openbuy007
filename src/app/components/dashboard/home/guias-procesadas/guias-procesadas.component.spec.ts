import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiasProcesadasComponent } from './guias-procesadas.component';

describe('GuiasProcesadasComponent', () => {
  let component: GuiasProcesadasComponent;
  let fixture: ComponentFixture<GuiasProcesadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuiasProcesadasComponent]
    });
    fixture = TestBed.createComponent(GuiasProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
