import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AccountAction } from './account-actions.service';
import { MessageService, Message } from './message.service';
import { UserSummary } from './account-actions.service';
import { DepositType } from './deposit-type.service';
import { LoanTypeService, LoanType } from './loan-type.service';

function decodeJwt(token: string | null): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try { return JSON.parse(atob(parts[1])); } catch { return null; }
}

export function normalizeStatus(v: unknown): 'approved'|'pending'|'rejected'|'unknown' {
  const s = String(v ?? '').trim().toLowerCase();
  if (['מאושר','approved','1'].includes(s))  return 'approved';
  if (['ממתין','pending','0'].includes(s))   return 'pending';
  if (['נדחה','rejected','2'].includes(s))   return 'rejected';
  return 'unknown';
}
  
export interface AppUser {
  id?: number;
  email?: string;
  firstName?: string;
  registrationStatus?: string | number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable(); 

  private accountActionsSubject = new BehaviorSubject<AccountAction[]>([]);
  accountActions$ = this.accountActionsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private userSummarySubject = new BehaviorSubject<UserSummary | null>(null);
  userSummary$ = this.userSummarySubject.asObservable();

  private depositTypesSubject = new BehaviorSubject<DepositType[]>([]);
  depositTypes$ = this.depositTypesSubject.asObservable();

  private loanTypesSubject = new BehaviorSubject<LoanType[]>([]);
  loanTypes$ = this.loanTypesSubject.asObservable();

  public isLoading = false;

  private isLoggingOut = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private messageService: MessageService,
    private loanTypeService: LoanTypeService
  ) {
    const savedToken = localStorage.getItem('token');
    if (savedToken) this.tokenSubject.next(savedToken);

    const savedUser = this.readStorage<AppUser>('user');
    this.userSubject.next(savedUser ?? null);

    this.accountActionsSubject.next(this.readStorage<AccountAction[]>('accountActions') ?? []);
    this.messagesSubject.next(this.readStorage<Message[]>('messages') ?? []);
    this.userSummarySubject.next(this.readStorage<UserSummary>('userSummary') ?? null);
    this.depositTypesSubject.next(this.readStorage<DepositType[]>('depositTypes') ?? []);
    this.loanTypesSubject.next(this.readStorage<LoanType[]>('loanTypes') ?? []);
  }

  private writeStorage(key: string, value: any) {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  }
  private readStorage<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    const payload = decodeJwt(t);
    if (!payload?.exp) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSec;
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    return !!t && !this.isTokenExpired(t);
  }

  getToken(): string | null {
    return this.tokenSubject.value ?? localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }

  forgotPassword(identifier: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/forgot-password`,
      { identifier }
    );
  }

  login(credentials: { emailOrId: string, password: string, institutionId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      identifier: credentials.emailOrId,
      password: credentials.password,
      institutionId: credentials.institutionId
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.tokenSubject.next(res.token);

        const user: AppUser = res.user ?? null;
        this.userSubject.next(user);
        this.writeStorage('user', user);
        if (user?.firstName) localStorage.setItem('userName', user.firstName);

        if (normalizeStatus(user?.registrationStatus) !== 'approved') {
          return;
        }
        this.refreshAllData().subscribe();
      })
    );
  }

  refreshAllData(): Observable<void> {
    if (this.isLoggingOut || !this.isLoggedIn()) return of(void 0);

    this.http.get<AccountAction[]>(`${this.apiUrl}/users/account-actions`)
      .subscribe({
        next: actions => {
          this.accountActionsSubject.next(actions);
          this.writeStorage('accountActions', actions);
        },
        error: err => console.warn('שגיאה בטעינת פעולות:', err)
      });

    this.messageService.getMessages().subscribe({
      next: messages => {
        this.messagesSubject.next(messages);
        this.writeStorage('messages', messages);
      },
      error: err => console.warn('שגיאה בטעינת הודעות:', err)
    });

    this.http.get<DepositType[]>(`${this.apiUrl}/DepositTypes`).subscribe({
      next: types => {
        this.depositTypesSubject.next(types);
        this.writeStorage('depositTypes', types);
      },
      error: err => console.warn('שגיאה בטעינת סוגי הפקדות:', err)
    });

    this.loanTypeService.getLoanTypes().subscribe({
      next: types => {
        this.loanTypesSubject.next(types);
        this.writeStorage('loanTypes', types);
      },
      error: err => console.warn('שגיאה בטעינת סוגי הלוואות:', err)
    });

    this.http.get<UserSummary>(`${this.apiUrl}/users/account-summary`).subscribe({
      next: summary => {
        this.userSummarySubject.next(summary);
        this.writeStorage('userSummary', summary);
      },
      error: err => console.warn('שגיאה בטעינת סיכום כספי:', err)
    });

    return of(void 0);
  }

  fetchUserFromServer(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/get-user/${userId}`);
  }

  setAccountActions(actions: AccountAction[]) {
    this.accountActionsSubject.next(actions);
    this.writeStorage('accountActions', actions);
  }
  setMessages(messages: Message[]) {
    this.messagesSubject.next(messages);
    this.writeStorage('messages', messages);
  }
  setUserSummary(summary: UserSummary) {
    this.userSummarySubject.next(summary);
    this.writeStorage('userSummary', summary);
  }
  setDepositTypes(types: DepositType[]) {
    this.depositTypesSubject.next(types);
    this.writeStorage('depositTypes', types);
  }
  setLoanTypes(types: LoanType[]) {
    this.loanTypesSubject.next(types);
    this.writeStorage('loanTypes', types);
  }

  getAccountActions(): AccountAction[] {
    return this.accountActionsSubject.value ?? [];
  }
  getMessages(): Message[] {
    return this.messagesSubject.value ?? [];
  }
  getUserSummary(): Observable<UserSummary | null> {
    return this.userSummary$;
  }
  getDepositTypes(): DepositType[] {
    return this.depositTypesSubject.value ?? [];
  }
  getLoanTypes(): LoanType[] {
    return this.loanTypesSubject.value ?? [];
  }
get isLoggingOutNow(): boolean {
  return this.isLoggingOut;
}
  getAccountActionsSnapshot(): AccountAction[] { return this.accountActionsSubject.value; }
  getMessagesSnapshot(): Message[] { return this.messagesSubject.value; }
  getDepositTypesSnapshot(): DepositType[] { return this.depositTypesSubject.value; }
  getLoanTypesSnapshot(): LoanType[] { return this.loanTypesSubject.value; }

  logout() {
    this.isLoggingOut = true;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');

    ['accountActions','messages','userSummary','depositTypes','loanTypes']
      .forEach(k => localStorage.removeItem(k));

    this.tokenSubject.next(null);
    this.userSubject.next(null); 
    this.accountActionsSubject.next([]);
    this.messagesSubject.next([]);
    this.userSummarySubject.next(null);
    this.depositTypesSubject.next([]);
    this.loanTypesSubject.next([]);

    this.zone.run(() => { this.router.navigateByUrl('/login', { replaceUrl: true }); });

    setTimeout(() => { this.isLoggingOut = false; }, 1000);
  }
}
