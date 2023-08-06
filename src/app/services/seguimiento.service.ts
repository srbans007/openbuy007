import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Seguimiento } from '../interfaces/seguimiento';


@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/seguimiento`;
    this.listar = ''
    this.insertar = '/insert'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSeguimiento(): Observable<Seguimiento[]> {
    return this.http.get<Seguimiento[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(`${this.myAppUrl}${this.insertar}`, seguimiento, { headers: this.headers });
  }
}
