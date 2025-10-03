import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class WaitingGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();

    if (user?.registrationStatus === 'ממתין') {
      this.router.navigate(['/awaiting-approval'], { replaceUrl: true });
      return false;
    }

    return true;
  }
}
