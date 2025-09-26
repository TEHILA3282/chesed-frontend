import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, normalizeStatus } from '../services/auth.service';
import { RejectedDialogComponent } from '../components/rejected-dialog/rejected-dialog';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

let handlingLogout = false;
let rejectedDialogOpen = false;

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (auth.isLoggingOutNow) return next(req);

  const token = auth.getToken();
  if (token && !auth.isTokenExpired(token)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  const isApi   = req.url.includes('/api/');
  const isLogin = req.method === 'POST' && /\/auth\/login/i.test(req.url);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (auth.isLoggingOutNow) return EMPTY;
      if (err.status === 0) return throwError(() => err);

      if (err.status === 401) {
        if (isLogin) return throwError(() => err);

        const hasToken = !!token;
        const expired = hasToken && auth.isTokenExpired(token!);
        const wwwAuth = (err.headers?.get?.('www-authenticate') || '').toLowerCase();
        const explicitInvalid =
          wwwAuth.includes('invalid_token') ||
          (typeof err.error === 'string' && err.error.toLowerCase().includes('invalid token'));

        if ((expired || explicitInvalid) && !handlingLogout) {
          handlingLogout = true;
          try { auth.logout(); } finally { setTimeout(() => handlingLogout = false, 500); }
          return EMPTY;
        }
        return throwError(() => err);
      }

      if (isApi && err.status === 403) {
        const userStatus = normalizeStatus(auth.currentUser?.registrationStatus);
        const serverSaysRejected =
          normalizeStatus(err.headers?.get?.('x-account-status') || undefined) === 'rejected';
        if (!rejectedDialogOpen && (userStatus === 'rejected' || serverSaysRejected)) {
          rejectedDialogOpen = true;
          const ref = dialog.open(RejectedDialogComponent);
          ref.afterClosed().subscribe(() => { rejectedDialogOpen = false; });
        }
      }

      return throwError(() => err);
    })
  );
};
