import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tienda } from '../interfaces/tienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/tienda`;
    this.listar = ''
    this.insertar = '/insert'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTienda(): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTienda(tienda: Tienda): Observable<Tienda> {
    return this.http.post<Tienda>(`${this.myAppUrl}${this.insertar}`, tienda, { headers: this.headers });
  }
}
