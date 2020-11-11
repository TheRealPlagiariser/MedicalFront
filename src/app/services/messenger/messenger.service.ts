import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  constructor(private http: HttpClient) {}

  createBatch(): Observable<any> {
    const body = {
      batch_date_from: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
    };

    console.log(body);

    return this.http.post(`${environment.apiUrl}/batches`, body);
  }

  Count(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/count`);
  }
}
