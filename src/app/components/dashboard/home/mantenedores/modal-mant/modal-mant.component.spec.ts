import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMantComponent } from './modal-mant.component';

describe('ModalMantComponent', () => {
  let component: ModalMantComponent;
  let fixture: ComponentFixture<ModalMantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalMantComponent]
    });
    fixture = TestBed.createComponent(ModalMantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
