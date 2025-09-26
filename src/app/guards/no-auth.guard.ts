import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InstitutionService } from '../services/institution.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private inst: InstitutionService) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return this.inst.tree(['home']);
    }
    return true;
  }
}
