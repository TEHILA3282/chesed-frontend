import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  router = inject(Router);
  private auth = inject(AuthService);

  isLoggedIn = false;
  userName = '';
  userRole = '';

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.checkLoginStatus());
  }

  private parseUser(userRaw: string | null) {
    try { return userRaw ? JSON.parse(userRaw) : null; }
    catch { return null; }
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    const parsedUser = this.parseUser(localStorage.getItem('user'));

    this.isLoggedIn = !!(token && parsedUser);
    this.userName = this.isLoggedIn ? `${parsedUser.firstName} ${parsedUser.lastName}` : '';
    this.userRole = this.isLoggedIn ? (parsedUser.role || '') : '';
  }

  logout(ev?: Event) {
    ev?.preventDefault();
    ev?.stopPropagation();
    this.auth.logout();
  }

  goHome() {
    if (this.userRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

@HostListener('keydown', ['$event'])
onKeydown(ev: Event) {
  const e = ev as KeyboardEvent;     // cast פנימי
  if (e.key === 'Enter' || e.code === 'Enter' || e.key === ' ') {
    const target = e.target as HTMLElement;
    if (target && target.closest('.nav-center')) {
      e.preventDefault();
      this.goHome();
    }
  }
}


}
