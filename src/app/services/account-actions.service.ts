import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface AccountAction {
  seder: number;
  perut: string;
  important: number;
}

export interface UserSummary {
  totalLoans: number;
  totalRepayments: number;
  totalDeposits: number;
  totalDonations: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountActionsService {
  private apiUrl = `${environment.apiUrl}/users/account-actions`;

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<AccountAction[]> {
    return this.http.get<AccountAction[]>(this.apiUrl);
  }

  getUserSummary(): Observable<UserSummary> {
    return this.http.get<UserSummary>(`${environment.apiUrl}/users/account-summary`);
  }

  getSummaryByUserId(userId: string): Observable<UserSummary> {
    return this.http.get<UserSummary>(`${this.apiUrl}/summary/${userId}`);
  }
}
