import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ruta } from '../interfaces/ruta';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private update: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/ruta`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'
    this.update = '/update'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRuta(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertRuta(ruta: Ruta[]): Observable<Ruta[]> {
    return this.http.post<Ruta[]>(`${this.myAppUrl}${this.insertar}`, ruta, { headers: this.headers });
  }

  updateRuta(ruta: Ruta[]): Observable<Ruta[]> {
    return this.http.post<Ruta[]>(`${this.myAppUrl}${this.update}`, ruta, { headers: this.headers });
  } 

  destroyRuta(ruta: Ruta[]): Observable<Ruta[]> {
    return this.http.post<Ruta[]>(`${this.myAppUrl}${this.eliminar}`, ruta, { headers: this.headers });
  }
}
