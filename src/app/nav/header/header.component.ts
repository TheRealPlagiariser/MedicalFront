import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  LoginForm: FormGroup;
  route: string;
  paths: String[];
  pinInserted:any;

  constructor(private router: Router,private location: Location, private authService: AuthService) {
    router.events.subscribe((val) => {
      this.route = location.path().substring(1);
      //this.paths = this.route.split('');
    });
  }
  logout() {
    this.authService.logout();
  }
  goMessenger() {
    this.pinInserted = this.LoginForm.value.pin;
    this.LoginForm.reset();
    if (this.pinInserted == '1234') {
      this.router.navigate(['/messenger']);
    } else {
      Swal.fire('Oops...', 'You have enter a wrong pin!', 'error');
      this.router.navigate(['']);
    }
  }
  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      pin: new FormControl(),
    });
  }
}
