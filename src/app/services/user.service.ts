import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl2: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl2 = 'api/users'
   }

   signIn(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl2}`, user);
   }

   login(user: User): Observable<string> {
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(user.username + ':' + user.password)
    });
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl2}/login`, user, { headers: headers });
   }
}

