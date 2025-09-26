import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { InstitutionService } from '../services/institution.service';

@Injectable({ providedIn: 'root' })
export class SlugGuard implements CanActivate {
  private inst = inject(InstitutionService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const slug = (route.paramMap.get('slug') || '').trim();
    return this.inst.isValidSlug(slug) ? true : this.router.parseUrl('/central');
  }
}
