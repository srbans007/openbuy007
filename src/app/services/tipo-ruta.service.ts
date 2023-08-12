import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoRuta } from '../interfaces/tipoRuta';

@Injectable({
  providedIn: 'root'
})
export class TipoRutaService {
  getSucursal() {
    throw new Error('Method not implemented.');
  }
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/tipoRuta`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTipoRuta(): Observable<TipoRuta[]> {
    return this.http.get<TipoRuta[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTipoRuta(tipoRuta: TipoRuta[]): Observable<TipoRuta[]> {
    return this.http.post<TipoRuta[]>(`${this.myAppUrl}${this.insertar}`, tipoRuta, { headers: this.headers });
  }

  destroyTipoRuta(tipoRuta: TipoRuta[]): Observable<TipoRuta[]> {
    return this.http.post<TipoRuta[]>(`${this.myAppUrl}${this.eliminar}`, tipoRuta, { headers: this.headers });
  }

}
