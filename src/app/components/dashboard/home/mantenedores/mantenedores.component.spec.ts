import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedoresComponent } from './mantenedores.component';

describe('MantenedoresComponent', () => {
  let component: MantenedoresComponent;
  let fixture: ComponentFixture<MantenedoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenedoresComponent]
    });
    fixture = TestBed.createComponent(MantenedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
