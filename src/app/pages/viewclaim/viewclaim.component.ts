import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users/users.service';
import { convertToCSV } from '../../../utils/generateCSV';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenerateReportDialogComponent } from './dialog-generate-report-dialog/dialog-generate-report-dialog.component';
import { addDays } from '@progress/kendo-date-math';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
export interface UserData {
  emp_id: string;
  emp_name: string;
  date_submit: string;
  batch_id: string;
  //claim_date: string;
  // despatch_date: string;
  batch_date_to: string;
  claim_id: string;
}

@Component({
  selector: 'app-viewclaim',
  templateUrl: './viewclaim.component.html',
  styleUrls: ['./viewclaim.component.css'],
})
export class ViewclaimComponent implements OnInit {
  error = false;
  checked = false;
  Alldata: Array<UserData>;
  @ViewChild('TABLE') table: ElementRef;

  public range = { start: null, end: null };

  _loading = true;
  // displayedColumns: string[] = ['id', 'Name', 'Email','Role', 'Department', 'Cost_Centre','Region','Address'];
  displayedColumns: string[] = [
    'emp_id',
    'emp_name',
    'number_of_claims',
    'date_submit',
    'batch_date_to',
    'batch_id',
    'claim_id',

    //'claim_date',
    //'despatch_date',
  ];

  // FILTERS
  _search: string = '';
  _selectedStatus: any = '';

  allSubmissions: Array<UserData>;

  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private usersService: UsersService, public GenerateReportDialog:MatDialog,private router: Router ) {}

  openGenerateReportDialog(){
   let GenerateReportDialogRef = this.GenerateReportDialog.open(DialogGenerateReportDialogComponent);
   GenerateReportDialogRef.afterClosed().subscribe(value => {
     console.log("Generate Report Dialog closed");
   });
  }

  handleCheckbox(e) {
    if (e.checked == true) {
      this._selectedStatus = null;
      this.filterSubmissions();
    } else {
      this.dataSource = new MatTableDataSource(
        this.Alldata.map((d) => {
          return {
            ...d,
            batch_date_to: d.batch_date_to
              ? this.ChangeViewDateFormat(new Date(d.batch_date_to))
              : 'pending',
          };
        })
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  filterSubmissions(): void {
    let filteredSubmissions: UserData[] = [...this.allSubmissions];

    filteredSubmissions = filteredSubmissions.filter(
      (b) => b.batch_date_to == this._selectedStatus
    );
    this.dataSource = new MatTableDataSource(
      filteredSubmissions.map((d) => {
        return {
          ...d,
          batch_date_to: d.batch_date_to
            ? this.ChangeViewDateFormat(new Date(d.batch_date_to))
            : 'pending',
        };
      })
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.usersService.getUsers().subscribe(
      (data: Array<UserData>) => {
        this.Alldata = data;

        //this._loading=false;
        //this.data = res;
        this.allSubmissions = data;
        this.dataSource = new MatTableDataSource(
          data.map((d) => {
            return {
              ...d,
              batch_date_to: d.batch_date_to
                ? this.ChangeViewDateFormat(new Date(d.batch_date_to))
                : 'pending',
            };
          })
        );
        console.log(data);

        //this.source = new LocalDataSource(this.data);
        // setTimeout(() => {this._loading=false},2000)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => console.log(err)
    );
  }
  goback() {
    this.router.navigate(['/hr']);
  }
  goMessenger() {
    this.router.navigate(['/messenger']);
  }

  ChangeViewDateFormat(d: Date): any {
    const d2: Date = new Date(d);
    const dd = String(d2.getDate()).padStart(2, '0');
    const mm = String(d2.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = d2.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let myRegEx = new RegExp('^([0-9]*[-][0-9-]*)$');
    console.log(filterValue.trim().toLowerCase());
    // console.log(myRegEx.test(filterValue.trim().toLowerCase()));
    if (myRegEx.test(filterValue)) {
      var buffer: string[] = filterValue.split('-');
      let x: string = '';
      //  console.log(buffer.length);
      //  console.log(buffer[1]);
      for (let i = buffer.length - 1; i >= 0; i--) {
        //  console.log('index:' + i);
        if (buffer[i].length % 2 == 0) x += buffer[i]; //concatenates current number if number is two digits
        if (i > 0) x += '-'; //contenates dash if not last iteration of loop
      }
      console.log('re-formatted: ' + x);
      this.dataSource.filter = x;
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log('curr_filter: ' + this.dataSource.filter);
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
  }
}
