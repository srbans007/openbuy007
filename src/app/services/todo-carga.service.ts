import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Todo_carga } from '../interfaces/todo-carga';
import { SeguimientoService } from '../services/seguimiento.service';

@Injectable({
  providedIn: 'root'
})
export class TodoCargaService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient
  ) {

    this.myAppUrl = `${environment.endpoint}api/troncal`;
    this.listar = ''
    this.insertar = '/insert'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTodoCarga(): Observable<Todo_carga[]> {
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTodoCarga(todoCarga: Todo_carga): Observable<any> {
    return this.http.post<Todo_carga>(`${this.myAppUrl}${this.insertar}`, todoCarga, { headers: this.headers })
  }
}
