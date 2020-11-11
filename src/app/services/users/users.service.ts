import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/claims`);
  }
  getStats(dateFrom, dateTo) {
    let url = `${environment.apiUrl}/range?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    console.log(dateFrom, dateTo, url);
    return this.http.get(url);
  }
}
