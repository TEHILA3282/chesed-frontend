import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface GuarantorRequest {
  idNumber: string | null;
  fullName: string | null;
  phone: string | null;
  occupation?: string | null;
  city?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  loanLink?: string | null;
  email?: string | null;
}

export interface CreateLoanRequest {
  loanTypeId: number;
  amount: number;
  paymentsCount: number;
  loanPurpose: string;
  description: string;
  isForApartment: boolean;
  apartmentConfirmed: boolean;
  guarantors: GuarantorRequest[];
}

@Injectable({ providedIn: 'root' })
export class LoansService {
  private baseUrl = `${environment.apiUrl}/Loans`;
  constructor(private http: HttpClient) {}
  create(data: CreateLoanRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }
}
