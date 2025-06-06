import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sucursal } from '../interfaces/sucursal';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/sucursal`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSucursal(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertSucursal(sucursales: Sucursal[]): Observable<Sucursal[]> {
    return this.http.post<Sucursal[]>(`${this.myAppUrl}${this.insertar}`, sucursales, { headers: this.headers });
  }

  destroySucursal(sucursales: Sucursal[]): Observable<Sucursal[]> {
    return this.http.post<Sucursal[]>(`${this.myAppUrl}${this.eliminar}`, sucursales, { headers: this.headers });
  }
}
