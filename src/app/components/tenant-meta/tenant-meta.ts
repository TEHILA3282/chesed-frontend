import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SeoService } from '../../services/seo.service';
import { TENANT_META } from '../../meta-config';

@Component({
  selector: 'app-tenant-meta',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class TenantMetaComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private seo = inject(SeoService);
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.applyMetaFromUrl());
    this.applyMetaFromUrl();
  }

  private applyMetaFromUrl() {
    const url = this.router.url;              
    const slug = (url.split('?')[0].split('#')[0].split('/').filter(Boolean)[0]) || '';
    const base = 'https://c-chesed.org.il';  
    const abs = `${base}${this.router.url}`;

    const meta = TENANT_META[slug] ?? {
      title: 'חפץ חסד – מערכת לניהול גמ"חים',
      description: 'המערכת המתקדמת לניהול גמ"חים: הלוואות, הפקדות ותרומות.',
      image: 'https://c-chesed.org.il/assets/hafetzLogo.png'
    };

    this.seo.setAll(meta, abs);

    if (slug) {
      const human = meta.title.replace(/ – .*$/, ''); 
      this.seo.setBreadcrumbJsonLd(
        `${base}/`,
        null,
        human,
        `${base}/${slug}`
      );
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
