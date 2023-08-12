import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehiculo } from '../interfaces/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/vehiculo`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVehiculo(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertVehiculo(vehiculo: Vehiculo[]): Observable<Vehiculo[]> {
    return this.http.post<Vehiculo[]>(`${this.myAppUrl}${this.insertar}`, vehiculo, { headers: this.headers });
  }

  destroyVehiculo(vehiculo: Vehiculo[]): Observable<Vehiculo[]> {
    return this.http.post<Vehiculo[]>(`${this.myAppUrl}${this.eliminar}`, vehiculo, { headers: this.headers });
  }
}


