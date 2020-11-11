import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MessengerService } from 'src/app/services/messenger/messenger.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
})
export class MessengerComponent implements OnInit {
  messengerForm = new FormGroup({
    claims: new FormControl(),
    received: new FormControl(),
  });
  constructor(
    private MessengerService: MessengerService,
    private router: Router
  ) {}
  goback() {
    this.router.navigate(['/viewClaim']);
  }
  submit() {
    // Swal.fire('Envelope collected', 'New Batch initiate', 'success');
    // this.router.navigate(['/employee']);
    // this.MessengerService.updateBatch().subscribe(
    //   (data) => {
    //     // this.router.navigate(['/employee']);
    //   }
    // );
    this.MessengerService.createBatch().subscribe((data) => {
      Swal.fire('Number of Envelope sent').then((result) => {
        if (result.value) {
          this.router.navigate(['/claimForm']);
        }
      });
    });
  }
  ngOnInit(): void {
    var count;
    this.MessengerService.Count().subscribe((data) => {
      count = data;
      this.messengerForm.setValue({"claims":count,"received":count})
   
    });
  }
  employee() {
    this.router.navigate(['/claimForm']);
  }
}
