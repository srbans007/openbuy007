import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCargaComponent } from './todo-carga.component';

describe('TodoCargaComponent', () => {
  let component: TodoCargaComponent;
  let fixture: ComponentFixture<TodoCargaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoCargaComponent]
    });
    fixture = TestBed.createComponent(TodoCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
