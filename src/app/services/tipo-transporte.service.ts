import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoTransporte } from '../interfaces/tipoTransporte';

@Injectable({
  providedIn: 'root'
})
export class TipoTransporteService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/tipoTransporte`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTipoTransporte(): Observable<TipoTransporte[]> {
    return this.http.get<TipoTransporte[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTipoTransporte(tipoTransporte: TipoTransporte[]): Observable<TipoTransporte[]> {
    return this.http.post<TipoTransporte[]>(`${this.myAppUrl}${this.insertar}`, tipoTransporte, { headers: this.headers });
  }

  destroyTipoTransporte(tipoTransporte: TipoTransporte[]): Observable<TipoTransporte[]> {
    return this.http.post<TipoTransporte[]>(`${this.myAppUrl}${this.eliminar}`, tipoTransporte, { headers: this.headers });
  }
}
