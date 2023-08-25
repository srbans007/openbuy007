import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GuiaProcesada } from '../interfaces/guiaProcesada';
import { Observable } from 'rxjs';
import { Todo_carga } from '../interfaces/todo-carga';
import { GuiaRuta } from '../interfaces/guiaRuta';

@Injectable({
  providedIn: 'root'
})
export class GuiasProcesadasService {
  private myAppUrl: string;
  private listar: string;
  private buscar: string;
  private buscarGuiaRuta: string;
  private update: string;
  private insertar: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient
  ) {

    this.myAppUrl = `${environment.endpoint}api/guiaProcesada`;
    this.listar = ''
    this.update = '/update'
    this.buscarGuiaRuta = '/buscarGuiaRuta'
    this.buscar = '/buscar'
    this.insertar = '/insert'

    this.headers = this.createHeaders();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getGuiaProcesada(): Observable<GuiaProcesada[]> {
    return this.http.get<GuiaProcesada[]>(`${this.myAppUrl}${this.listar}`, { headers: this.headers });
  }

  getBuscarGuia(valor: string): Observable<GuiaProcesada[]> {
    return this.http.get<GuiaProcesada[]>(`${this.myAppUrl}${this.buscar}?valor=${valor}`, { headers: this.headers });
  }

  getBuscarGuiaRuta(valor: string): Observable<GuiaRuta[]> {
    return this.http.get<GuiaRuta[]>(`${this.myAppUrl}${this.buscarGuiaRuta}?valor=${valor}`, { headers: this.headers });
  }

  updateGuia(ruta: GuiaProcesada[]): Observable<GuiaProcesada[]> {
    return this.http.post<GuiaProcesada[]>(`${this.myAppUrl}${this.update}`, ruta, { headers: this.headers });
  } 

  insertGuiaProcesada(guiaProcesada: GuiaProcesada[]): Observable<any> {
    return this.http.post<GuiaProcesada[]>(`${this.myAppUrl}${this.insertar}`, guiaProcesada, { headers: this.headers })
  }
}
