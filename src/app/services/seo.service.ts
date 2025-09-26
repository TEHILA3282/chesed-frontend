import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export type TenantMeta = {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  setAll(metaData: TenantMeta, urlAbs: string) {
    this.title.setTitle(metaData.title);

    this.meta.updateTag({ name: 'description', content: metaData.description });
    if (metaData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: metaData.title });
    this.meta.updateTag({ property: 'og:description', content: metaData.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: urlAbs });
    this.meta.updateTag({ property: 'og:site_name', content: 'חפץ חסד' });
    if (metaData.image) {
      this.meta.updateTag({ property: 'og:image', content: metaData.image });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: metaData.title });
    this.meta.updateTag({ name: 'twitter:description', content: metaData.description });
    if (metaData.image) {
      this.meta.updateTag({ name: 'twitter:image', content: metaData.image });
    }
  }

  setBreadcrumbJsonLd(homeUrl: string, listingUrl: string | null, tenantName: string, tenantUrl: string) {
    const scriptId = 'cc-breadcrumbs-jsonld';
    document.getElementById(scriptId)?.remove();

    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'בית', item: homeUrl },
        ...(listingUrl ? [{ '@type': 'ListItem', position: 2, name: 'גמ"חים', item: listingUrl }] : []),
        { '@type': 'ListItem', position: listingUrl ? 3 : 2, name: tenantName, item: tenantUrl }
      ]
    };

    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = scriptId;
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
}
