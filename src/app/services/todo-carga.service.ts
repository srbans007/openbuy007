import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Todo_carga } from '../interfaces/todo-carga';

@Injectable({
  providedIn: 'root'
})
export class TodoCargaService {
  private myAppUrl: string;
  private myApiUrl2: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl2 = 'api/troncal'
  }

  getTodoCarga(): Observable<Todo_carga[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.myApiUrl2}`, { headers: headers })
    //return this.http.get<Todo_carga[]>(`${this.myAppUrl}${this.myApiUrl2}`)
  }
}
