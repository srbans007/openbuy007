import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Todo_carga } from '../interfaces/todo-carga';

@Injectable({
  providedIn: 'root'
})
export class TodoCargaService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.listar = 'api/troncal'
    this.insertar = 'api/troncal/insert'
  }

  getTodoCarga(): Observable<Todo_carga[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.listar}`, { headers: headers })
  }

  insertTodoCarga(todoCarga: Todo_carga): Observable<Todo_carga> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.post<Todo_carga>(`${this.myAppUrl}${this.insertar}`, todoCarga, { headers: headers })
  }
}
