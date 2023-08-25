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
  private seguimiento: string;
  private buscar: string;
  private update: string;
  private guiaRuta: string;
  private insertar: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient
  ) {

    this.myAppUrl = `${environment.endpoint}api/troncal`;
    this.listar = ''
    this.seguimiento = '/seguimiento'
    this.guiaRuta = '/guiaRuta'
    this.update = '/update'
    this.buscar = '/buscar'
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

  getSeguimiento(): Observable<Todo_carga[]> {
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.seguimiento}`, { headers: this.headers });
  }

  getBuscarGuia(valor: string): Observable<Todo_carga[]> {
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.buscar}?valor=${valor}`, { headers: this.headers });
  }

  getDatosGuiaRuta(): Observable<Todo_carga[]> {
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.guiaRuta}`, { headers: this.headers });
  }

  getDatosGuiaRutaPorRutaId(ruta_id: number): Observable<Todo_carga[]> {
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.guiaRuta}?ruta_id=${ruta_id}`, { headers: this.headers });
  }

  updateGuia(ruta: Todo_carga[]): Observable<Todo_carga[]> {
    return this.http.post<Todo_carga[]>(`${this.myAppUrl}${this.update}`, ruta, { headers: this.headers });
  } 

  insertTodoCarga(todoCarga: Todo_carga): Observable<any> {
    return this.http.post<Todo_carga>(`${this.myAppUrl}${this.insertar}`, todoCarga, { headers: this.headers })
  }
}
