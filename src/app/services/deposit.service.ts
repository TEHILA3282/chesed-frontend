import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepositType } from './deposit-type.service';
import { environment } from '../environments/environment';

export interface CreateDepositDto {
  depositTypeId: number;
  amount: number | null;
  purposeDetails: string;
  isDirectDeposit: boolean;
  depositDate?: string | null;           
  depositReceivedDate?: string | null; 
  paymentMethod?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {
private apiUrl = `${environment.apiUrl}/DepositTypes`;

  constructor(private http: HttpClient) {}
getDepositTypeById(id: number): Observable<DepositType> {
  return this.http.get<DepositType>(`${this.apiUrl}/${id}`);
}

addDeposit(deposit: CreateDepositDto) {
  return this.http.post(`${environment.apiUrl}/Deposits`, deposit);
}
}
