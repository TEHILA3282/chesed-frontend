import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router'; // ← הוספנו Router
import { InstitutionService } from './services/institution.service';
import { HeaderComponent } from './components/header/header';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private titleService: Title,
    private institutionService: InstitutionService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const fix = this.institutionService.tryFixMissingSlugOnLoad?.();
    if (fix) {
      this.router.navigateByUrl(fix, { replaceUrl: true });
      return;
    }

    const inst = this.institutionService.getInstitution();
    this.titleService.setTitle(inst.name);

    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = inst.logo;
    document.getElementsByTagName('head')[0].appendChild(link);

    if (this.auth.isLoggedIn()) {
      this.auth.refreshAllData().subscribe();
    }
  }
}
