import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { InstitutionService } from '../services/institution.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private inst: InstitutionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token');

    const url = (state.url || '').toLowerCase();
    const isPublic =
      url.startsWith('/login') ||
      url.startsWith('/forgot-password') ||
      url === '/' || url.startsWith('/home-public');
    if (isPublic) return true;

    if (!token) return this.inst.tree(['login']);

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const expMs = typeof payload?.exp === 'number' ? payload.exp * 1000 : 0;
      if (!expMs || expMs <= Date.now()) {
        localStorage.removeItem('token');
        return this.inst.tree(['login']);
      }
      return true;
    } catch {
      localStorage.removeItem('token');
      return this.inst.tree(['login']);
    }
  }
}
