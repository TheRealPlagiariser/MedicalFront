import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { StorageService } from './services/auth/storage/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public href: string = '';
  title = 'medical';

  show: boolean = false;

  constructor(
    location: Location,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    router.events.subscribe((val) => {
      this.show = location.path() != '' ? true : false;
    });
  }

  ngOnInit(): void {
    // Redirect user if cookie is valid
    if (this.authService.isAuthenticated() && window.location.pathname == '/') {
      const role = this.storageService.getCookie('role');
      this.router.navigate(['/']);
    }
  }
}
