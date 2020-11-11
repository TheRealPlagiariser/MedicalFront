import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from './storage/storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(``, { email, password });
  // }
  logout(): void {
    this.storageService.deleteAllCookies();
    this.router.navigate(['']);
  }
  isAuthenticated(): boolean {
    const id = this.storageService.getCookie('id');
    // const role = this.storageService.getCookie('role');
    const token = this.storageService.getCookie('token');
    // const name = this.storageService.getCookie('name');

    return (
      id.length > 0 && token.length > 0
    );
  }
}
