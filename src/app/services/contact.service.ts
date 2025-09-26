import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment'; 

export interface InstitutionPublicInfo {
  institutionId: number;
  phone: string;
  availabilityText: string;
}

export interface ContactRequestCreate {
  institutionId: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  private readonly info$ = new BehaviorSubject<InstitutionPublicInfo | null>(null);

  private fetchPublicInfo() {
    return this.http.get<InstitutionPublicInfo>(`${this.apiUrl}/institutions/public-info`);
  }

  async preloadPublicInfo(): Promise<void> {
    try {
      const data = await firstValueFrom(this.fetchPublicInfo());
      this.info$.next(data);
    } catch (err) {
      console.error('Failed to preload public info', err);
      this.info$.next(null);
    }
  }

  publicInfo$() {
    return this.info$.asObservable();
  }

  get currentPublicInfo(): InstitutionPublicInfo | null {
    return this.info$.value;
  }

  async refreshPublicInfo(): Promise<void> {
    await this.preloadPublicInfo();
  }

  async submitContact(payload: ContactRequestCreate) {
    return await firstValueFrom(
      this.http.post<{ id: number }>(`${this.apiUrl}/contact`, payload)
    );
  }
}
