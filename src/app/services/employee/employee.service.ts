import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  makeclaim(
    id: number,
    email: string,
    pwd: string,
    batch: number,
    claims_num: number
  ): Observable<any> {
    const body = {
      emp_id: id,
      first_name: email,
      last_name: pwd,
      claim_date: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
      batch_id: batch,
      number_of_claims: claims_num,
    };

    console.log(body);

    return this.http.post(`${environment.apiUrl}/claims`, body);
  }

  getbatch(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/batches`);
  }
}
