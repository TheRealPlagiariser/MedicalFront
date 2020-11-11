import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.css'],
})
export class HrComponent implements OnInit {
  LoginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router,) { }
  makeClaims() {
    this.router.navigate(['/employee']);
  }
  viewClaims() {
    this.router.navigate(['/view']);
  }
  goMessenger() {
    if (this.LoginForm.value.pin == "1234") {
      this.router.navigate(['/messenger']);
    } else {
      Swal.fire('Oops...', 'You have enter a wrong pin!', 'error')

    }
  }
  logout() {
    this.authService.logout()
  }
  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      pin: new FormControl()
    });
  }
}
