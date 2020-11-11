import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  login(pwd: string): Observable<any> {
    const body = {
      password: pwd,
    };
    return this.http.post(`${environment.apiUrl}/auth`, body);
  }
}
