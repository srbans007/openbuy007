import { Component } from '@angular/core';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-carga',
  templateUrl: './todo-carga.component.html',
  styleUrls: ['./todo-carga.component.scss']
})
export class TodoCargaComponent {
  listGuias: Todo_carga[] = []

  constructor(
    private router: Router,
    private _TodoCargaService: TodoCargaService

  ) { }

  ngOnInit(): void {
    this.getGuias();
  }

  getGuias() {
    this._TodoCargaService.getTodoCarga()
      .pipe(
        catchError(error => {
          if (error.status === 400) {
            // Aquí debes manejar tu lógica de logout, por ejemplo:
            this.logOut(); // Asegúrate de tener definida esta función
            console.log("aqui deberia mandarlo a la mierde")
          }
          throw error;
        })
      )
      .subscribe(data => {
          this.listGuias = data;
      }, error => {
          console.error('Ocurrió un error:', error);
      });
  }


  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
