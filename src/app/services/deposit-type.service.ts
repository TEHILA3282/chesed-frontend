import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DepositType {
  id: number;
  name: string;
  description: string;
  isDirectDebit?: boolean; 
}

@Injectable({ providedIn: 'root' })
export class DepositTypeService {
  private apiUrl = `${environment.apiUrl}/DepositTypes`;

  constructor(private http: HttpClient) {}

  getDepositTypes(): Observable<DepositType[]> {
    return this.http.get<DepositType[]>(this.apiUrl);
  }

  getDepositTypeById(id: number): Observable<DepositType> {
    return this.http.get<DepositType>(`${this.apiUrl}/${id}`);
  }
}
