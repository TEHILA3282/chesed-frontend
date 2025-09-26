import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface CreateDepositWithdraw { amount: number; requestText: string; }
export interface DepositWithdrawResponse {
  id: number; amount: number; requestText: string; status: string; createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DepositWithdrawService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  create(payload: CreateDepositWithdraw) {
    return this.http.post<DepositWithdrawResponse>(`${this.api}/deposits/withdrawals`, payload);
  }
}
