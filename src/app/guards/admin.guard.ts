import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InstitutionService } from '../services/institution.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private inst: InstitutionService) {}

  canActivate(): boolean | UrlTree {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Admin') return true;
    return this.inst.tree(['home']);
  }
}
