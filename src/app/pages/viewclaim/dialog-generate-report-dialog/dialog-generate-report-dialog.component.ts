import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { convertToCSV } from '../../../../utils/generateCSV';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-generate-report-dialog',
  templateUrl: './dialog-generate-report-dialog.component.html',
  styleUrls: ['./dialog-generate-report-dialog.component.css']
})
export class DialogGenerateReportDialogComponent implements OnInit {
  
  error = false;
  public range = { start: null, end: null };


  constructor(public GenerateReportDialogRef: MatDialogRef<DialogGenerateReportDialogComponent>, private usersService: UsersService) { }

  ngOnInit(): void {
  }

  closeDialog(){
    this.GenerateReportDialogRef.close();
  }

  generate_csv() {
    this.error = false;
    if (this.range.start.getTime() != this.range.end.getTime()) {
      this.range.start.setHours(this.range.start.getHours() + 4);
      this.range.end.setHours(this.range.end.getHours() + 4);
      var from =
        this.range.start.toISOString().substr(0, 10) + ' ' + '00:00:00';
      var to = this.range.end.toISOString().substr(0, 10) + ' ' + '00:00:00';
    } else {
      this.range.start.setHours(this.range.start.getHours() + 4);
      this.range.end.setHours(this.range.end.getHours() + 4);

      var from =
        this.range.start.toISOString().substr(0, 10) + ' ' + '00:00:00';
      var to = this.range.end.toISOString().substr(0, 10) + ' ' + '00:00:00';
    }

    console.log(from, to);
    this.usersService.getStats(from, to).subscribe((data: any) => {
      let reports = data;
      console.log('aaaaaaaa');
      console.log(reports);
      if (reports.length != 0) {
        let r2 = reports.map((r) => ({
          'Employee ID': r.emp_id,
          'Employee Name': r.emp_name,
          'Number of claims': r.number_of_claims,
          'Submit Date': r.date_submit,
          'Despatch Date': r.batch_date_to,
          'Batch ID': r.batch_id,
          'Claim ID': r.claim_id,
        }));
        console.log(`${from} to ${to}.csv`);

        // this.bookings = [];

        convertToCSV(r2, `${from} to ${to}.csv`);
      } else {
        this.error = true;
      }
    });
    
    this.closeDialog();
  }

}
