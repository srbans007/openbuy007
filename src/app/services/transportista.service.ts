import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transportista } from '../interfaces/transportista';

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/transportista`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTransportista(): Observable<Transportista[]> {
    return this.http.get<Transportista[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTransportista(transportista: Transportista[]): Observable<Transportista[]> {
    return this.http.post<Transportista[]>(`${this.myAppUrl}${this.insertar}`, transportista, { headers: this.headers });
  }

  destroyTransportista(transportista: Transportista[]): Observable<Transportista[]> {
    return this.http.post<Transportista[]>(`${this.myAppUrl}${this.eliminar}`, transportista, { headers: this.headers });
  }
}