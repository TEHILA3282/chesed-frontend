import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface LoanType {
  id: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class LoanTypeService {
  private baseUrl = `${environment.apiUrl}/LoanTypes`;

  constructor(private http: HttpClient) {}

  getLoanTypes(): Observable<LoanType[]> {
    return this.http.get<LoanType[]>(this.baseUrl);
  }

  getLoanTypeById(id: number): Observable<LoanType> {
    return this.http.get<LoanType>(`${this.baseUrl}/${id}`);
  }
}
