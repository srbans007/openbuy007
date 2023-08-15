import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRutasComponent } from './modal-rutas.component';

describe('ModalRutasComponent', () => {
  let component: ModalRutasComponent;
  let fixture: ComponentFixture<ModalRutasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRutasComponent]
    });
    fixture = TestBed.createComponent(ModalRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
