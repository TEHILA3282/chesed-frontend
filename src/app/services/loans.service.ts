import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface CreateLoanRequest {
  loanTypeId: number;
  amount: number;
  paymentsCount: number;
  loanPurpose: string;
  description: string;
  isForApartment: boolean;
  apartmentConfirmed: boolean;
   guarantors: {
    idNumber: string;
    fullName: string;
    phone: string;
    occupation?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    loanLink?: string;
    email?: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class LoansService {
  private baseUrl = `${environment.apiUrl}/Loans`;

  constructor(private http: HttpClient) {}

  create(data: CreateLoanRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }
}
