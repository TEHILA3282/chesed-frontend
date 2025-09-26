import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegistrationCreateDto {
  ID: string;
  Email: string;
  Password: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  LandlineNumber?: string;
  DateOfBirth?: string;
  PersonalStatus?: string;
  Street?: string;
  City?: string;
  HouseNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly api = `${environment.apiUrl}/registration`;

  constructor(private http: HttpClient) {}

  register(data: RegistrationCreateDto): Observable<any> {
    return this.http.post(this.api, data);
  }

  checkEmailOrIdExists(
    email: string,
    id: string,
    institutionId: number
  ): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/check-exists`, {
      params: { email, id, institutionId: String(institutionId) }
    });
  }
}
