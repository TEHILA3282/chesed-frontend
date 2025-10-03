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
  private readonly LS_KEY = 'publicInfoCache';

  private readonly info$ = new BehaviorSubject<InstitutionPublicInfo | null>(null);

  constructor() {
    // הידרציה מיידית מה־localStorage למניעת ברירת־מחדל אחרי רענון
    const raw = localStorage.getItem(this.LS_KEY);
    if (raw) {
      try { this.info$.next(JSON.parse(raw)); } catch {}
    }
    // טעינה/רענון מהשרת ברקע
    this.preloadPublicInfo().catch(() => {});
  }

  private fetchPublicInfo() {
    // הנתיב הזה חייב להיות קיים בשרת (ראו Backend למטה)
    return this.http.get<InstitutionPublicInfo>(`${this.apiUrl}/institutions/public-info`);
  }

  async preloadPublicInfo(): Promise<void> {
    try {
      const data = await firstValueFrom(this.fetchPublicInfo());
      this.info$.next(data ?? null);
      if (data) localStorage.setItem(this.LS_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to preload public info', err);
      // שומרים את הקאש הקיים אם יש
    }
  }

  publicInfo$() {
    return this.info$.asObservable();
  }

  get currentPublicInfo(): InstitutionPublicInfo | null {
    return this.info$.value;
  }

  async refreshPublicInfo(force = false): Promise<void> {
    if (force) localStorage.removeItem(this.LS_KEY);
    await this.preloadPublicInfo();
  }

  async submitContact(payload: ContactRequestCreate) {
    return await firstValueFrom(
      this.http.post<{ id: number }>(`${this.apiUrl}/contact`, payload)
    );
  }
}
