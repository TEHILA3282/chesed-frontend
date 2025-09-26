import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService, normalizeStatus } from '../services/auth.service';
import { InstitutionService } from '../services/institution.service';

@Injectable({ providedIn: 'root' })
export class PendingGuard implements CanActivate {
  constructor(private auth: AuthService, private inst: InstitutionService) {}

  canActivate(): boolean | UrlTree {
    const token = this.auth.getToken();
    if (!token || this.auth.isTokenExpired(token)) {
      return this.inst.tree(['login']);
    }

    const status = normalizeStatus(this.auth.currentUser?.registrationStatus);

    if (status === 'pending') {
      return this.inst.tree(['awaiting-approval']);
    }
    if (status === 'rejected') {
      return this.inst.tree(['login']);
    }
    return true;
  }
}
