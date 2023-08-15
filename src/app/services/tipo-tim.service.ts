import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tim } from '../interfaces/tim';

@Injectable({
  providedIn: 'root'
})
export class TipoTimService {
  private myAppUrl: string;
  private listar: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/tim`;
    this.listar = ''
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTim(): Observable<Tim[]> {
    return this.http.get<Tim[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  insertTim(tim: Tim[]): Observable<Tim[]> {
    return this.http.post<Tim[]>(`${this.myAppUrl}${this.insertar}`, tim, { headers: this.headers });
  }

  destroyTim(tim: Tim[]): Observable<Tim[]> {
    return this.http.post<Tim[]>(`${this.myAppUrl}${this.eliminar}`, tim, { headers: this.headers });
  }
}
