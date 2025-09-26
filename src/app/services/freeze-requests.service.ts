import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export type FreezeRequestPayload = {
  requestType: 1 | 2;   
  reason: string;
  acknowledged: boolean;
};

@Injectable({ providedIn: 'root' })

export class FreezeRequestsService {
  private baseUrl = `${environment.apiUrl}/freeze-requests`;
  constructor(private http: HttpClient) {}
  create(payload: FreezeRequestPayload) {
    return this.http.post(this.baseUrl, payload);
  }
}