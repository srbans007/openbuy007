import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTimComponent } from './tipo-tim.component';

describe('TipoTimComponent', () => {
  let component: TipoTimComponent;
  let fixture: ComponentFixture<TipoTimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoTimComponent]
    });
    fixture = TestBed.createComponent(TipoTimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
