import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Message {
  perut: string;
  important: number;
  seder: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/users/messages`;
  private loadUrl = `${environment.apiUrl}/admin/load-messages-test`;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Message[]>(this.apiUrl, { headers });
  }

  loadMessagesTest(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.loadUrl, { headers });
  }
}
