import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface SearchResult {
  type: 'loanType' | 'depositType' | 'message' | 'route';
  id?: number;
  title: string;
  subtitle?: string;
  snippet?: string;
  route: string;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

suggest(q: string): Observable<SearchResult[]> {
  return this.http.get<SearchResult[]>(`${environment.apiUrl}/search/suggest`, { params: { q } });
}

search(q: string): Observable<SearchResult[]> {
  return this.http.get<SearchResult[]>(`${environment.apiUrl}/search`, { params: { q } });
}
}
