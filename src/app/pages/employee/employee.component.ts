import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

// MDB Angular Free
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  claimForm: FormGroup;
  LoginForm: FormGroup;
  _error = false;
  _loading = false;
  _batch;

  isLoading:boolean = false;

  constructor( private EmployeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.claimForm = new FormGroup({
      emp_id: new FormControl(null, [Validators.required]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      // number_of_claims: new FormControl(null, [Validators.required]),
      number_of_claims: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(2),
      ]),
    });
    this.LoginForm = new FormGroup({
      pin: new FormControl(),
    });
  }

  get noClaims() {
    return this.claimForm.get('number_of_claims') as FormControl;
  }

  goback() {
    this.router.navigate(['/hr']);
  }
  goMessenger() {
    if (this.LoginForm.value.pin == '1234') {
      this.router.navigate(['/messenger']);
    } else {
      Swal.fire('Oops...', 'You have enter a wrong pin!', 'error');
    }
  }

  get firstName() {
    return this.claimForm.get('first_name') as FormControl;
  }

  get lastName() {
    return this.claimForm.get('last_name') as FormControl;
  }

  get empID() {
    return this.claimForm.get('emp_id') as FormControl;
  }
  how() {
    Swal.mixin({
      title: 'Sweet!',
      text: 'Modal with a custom image.',
      imageUrl: '../../../assets/1.gif',
      imageWidth: 250,
      imageHeight: 250,
      imageAlt: 'Custom image',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: false,
      progressSteps: ['1', '2', '3'],
    })
      .queue([
        {
          title: 'First!',
          text: 'Group your claims in one envelope or staple them.',
          imageUrl: '../../../assets/1.gif',
          imageWidth: 250,
          imageHeight: 250,
          imageAlt: 'Custom image',
        },
        {
          title: 'Second!',
          text: 'One envelope/group is one submission.',
          imageUrl: '../../../assets/2.gif',
          imageWidth: 250,
          imageHeight: 250,
          imageAlt: 'Custom image',
        },
        {
          title: 'Third!',
          text:
            'Fill the form, click the submit button, drop your claims in the box.',
          imageUrl: '../../../assets/3.gif',
          imageWidth: 250,
          imageHeight: 250,
          imageAlt: 'Custom image',
        },
      ])
      .then((result) => {
        if (result) {
          const answers = JSON.stringify(result);
          Swal.fire({
            title: 'All done!',
            imageUrl: '../../../assets/makeclaim.gif',
            imageWidth: 250,
            imageHeight: 250,
            confirmButtonText: 'Ok',
          });
        }
      });
  }

  clearClaimForm(){
    this.claimForm.reset(); 
  }

  submitClaim() {
    var batchid;
    this.isLoading=true;
    this.EmployeeService.getbatch().subscribe((data) => {
      const batch_id = data[0]['batch_id'];
      console.log(this._batch);

      const id = this.claimForm.value.emp_id;
      const first_name = this.claimForm.value.first_name;
      const last_name = this.claimForm.value.last_name;
      const noClaims = this.claimForm.value.number_of_claims;
      this.EmployeeService.makeclaim(
        id,
        first_name,
        last_name,
        batch_id,
        noClaims
      ).subscribe(
        (data) => {
          Swal.fire('Claim sent');
          this.clearClaimForm();
          
        this.isLoading=false;
          this.router.navigate(['/claimForm']);
        },
        (err) => {
          this._error = true;
          this._loading = false;
          Swal.fire('Oops...', 'An error has occured, retry!', 'error');
          this.isLoading=false;
          this.clearClaimForm();
        }
      );
    });

    // console.log(batchid);
  }
}
