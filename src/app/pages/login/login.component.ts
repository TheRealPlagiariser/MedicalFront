import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/services/auth/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  _error = false;
  _loading = false;
  err = false;

  constructor(
    private LoginService: LoginService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this._loading=false;
    this.LoginForm = new FormGroup({
      password: new FormControl(),
    });
  }
  loginUser() {
    // if (this.LoginForm.value.email == "hr@gmail.com" && this.LoginForm.value.password == "12345") {
    //   this.router.navigate(['/hr']);
    // }
    const pwd = this.LoginForm.value.password;
    this._loading=true;
    this.LoginService.login(pwd).subscribe(
      (data) => {
        console.log(data);
        this.storageService.createCookie('id', data['id'], 1);
        this.storageService.createCookie('token', data['token'], 1);
        this._loading = false;
        this.router.navigate(['/claimForm']);
        
      },
      (err) => {
        this._error = true;
        this._loading = false;
        Swal.fire('Oops...', 'You have entered a wrong pin!', 'error');
      }
    );
  }
}
