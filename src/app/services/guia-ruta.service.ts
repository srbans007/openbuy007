import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GuiaRuta } from '../interfaces/guiaRuta';

@Injectable({
  providedIn: 'root'
})
export class GuiaRutaService {
  private myAppUrl: string;
  private listar: string;
  private listarId: string;
  private insertar: string;
  private eliminar: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.myAppUrl = `${environment.endpoint}api/guia`;
    this.listar = ''
    this.listarId = '/id'
    this.insertar = '/insert'
    this.eliminar = '/eliminar'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getGuiaRuta(): Observable<GuiaRuta[]> {
    return this.http.get<GuiaRuta[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  getGuiaRutaId(id: number): Observable<GuiaRuta[]> {
    return this.http.get<GuiaRuta[]>(`${this.myAppUrl}${this.listarId}?id_ruta=${id}`, { headers: this.headers });
  }

  insertGuiaRuta(guia: GuiaRuta[]): Observable<GuiaRuta[]> {
    return this.http.post<GuiaRuta[]>(`${this.myAppUrl}${this.insertar}`, guia, { headers: this.headers });
  }

  destroyGuiaRuta(guia: GuiaRuta[]): Observable<GuiaRuta[]> {
    return this.http.post<GuiaRuta[]>(`${this.myAppUrl}${this.eliminar}`, guia, { headers: this.headers });
  }
}
