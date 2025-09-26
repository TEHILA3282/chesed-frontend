import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, UrlTree } from '@angular/router';
import type { TenantMeta } from './seo.service';

export interface InstitutionConfig {
  id: number;
  name: string;
  logo: string;
  themeColor: string;
  slug?: string;
  programsTitle?: string;     // כותרת לעמוד תוכניות/פרסומת
  programsSubtitle?: string;  // ← חדש: תת־כותרת (עבור home.html)
}

@Injectable({ providedIn: 'root' })
export class InstitutionService {
  private readonly ROOT_HOSTS = ['c-chesed.org.il', 'www.c-chesed.org.il'];
  private readonly DEFAULT_KEY = 'central';
  private readonly LAST_SLUG_KEY = 'lastSlug';

  private normalizeKey(k: string): string { return (k || '').trim().toLowerCase(); }

  private readonly institutionMap: Record<string, InstitutionConfig> = {
    central: {
      id: 1, name: 'הגמ"ח המרכזי', logo: 'assets/logo-central.png', themeColor: '#222', slug: 'central',
      programsTitle: 'תוכניות ושותפים – הגמ"ח המרכזי',
      programsSubtitle: 'מידע ותיאורים קצרים על התוכניות'
    },
    chaiad: {
      id: 2, name: 'גמ"ח חי עד', logo: 'assets/download.png', themeColor: '#0aa', slug: 'chaiad',
      programsTitle: 'תוכניות ושותפים – חי עד',
      programsSubtitle: 'תתי־כותרת לתוכניות חי עד'
    },
    chavuratchesed: {
      id: 3, name: 'חבורת חסד', logo: 'assets/chavuratChesed.png', themeColor: '#e67e22', slug: 'chavuratchesed',
      programsTitle: 'פרסומת הגמ"ח – חבורת חסד',
      programsSubtitle: 'מידע קצר על פעילויות ושותפים'
    },
    localhost: {
      id: 1, name: 'הגמ"ח המרכזי (localhost)', logo: 'assets/logo-localhost.png', themeColor: '#222', slug: 'localhost',
      programsTitle: 'תוכניות ושותפים – (localhost)',
      programsSubtitle: 'תת־כותרת לדבאג מקומי'
    }
  };

  private config: InstitutionConfig = {
    id: 0, name: 'מוסד לא ידוע', logo: 'assets/default-logo.png', themeColor: '#ccc', slug: ''
  };

  constructor(@Inject(DOCUMENT) private doc: Document, private router: Router) {
    const host = this.normalizeKey(this.doc.location.hostname);

    const qp = new URLSearchParams(this.doc.location.search);
    const qKey = this.normalizeKey(qp.get('inst') || qp.get('institution') || qp.get('gmach') || '');

    const segs = this.doc.location.pathname.split('/').filter(Boolean);
    const pathFirst = this.normalizeKey(segs[0] === 'index.html' ? '' : (segs[0] || ''));

    let key = '';
    if (qKey && this.institutionMap[qKey]) key = qKey;
    else if (pathFirst && this.institutionMap[pathFirst]) key = pathFirst;
    else if (host === 'localhost' || host === '127.0.0.1') key = 'localhost';
    else if (this.ROOT_HOSTS.includes(host)) key = this.getLastSlug() || this.DEFAULT_KEY;
    else key = this.DEFAULT_KEY;

    this.config = { ...(this.institutionMap[key] ?? this.institutionMap[this.DEFAULT_KEY] ?? this.config) };

    const currentSlug = this.getCurrentSlug();
    const slugToSave = currentSlug || key;
    if (slugToSave) { try { localStorage.setItem(this.LAST_SLUG_KEY, slugToSave); } catch {} }
  }

  isValidSlug(slug: string): boolean { return !!this.institutionMap[this.normalizeKey(slug)]; }

  getCurrentSlug(): string {
    const first = this.normalizeKey(this.doc.location.pathname.split('/').filter(Boolean)[0] || '');
    return this.institutionMap[first] ? first : '';
  }

  private getLastSlug(): string {
    try {
      const s = this.normalizeKey(localStorage.getItem(this.LAST_SLUG_KEY) || '');
      return this.institutionMap[s] ? s : '';
    } catch { return ''; }
  }

  getSlug(): string {
    return this.config.slug || this.getCurrentSlug() || this.getLastSlug() || this.DEFAULT_KEY;
  }

  getInstitution(): InstitutionConfig { return this.config; }
  getInstitutionId(): number { return this.config.id; }

  link(commands: any[]): any[] {
    const slug = this.getSlug();
    return slug ? ['/', slug, ...commands.filter(Boolean)] : ['/', ...commands.filter(Boolean)];
  }
  tree(commands: any[]): UrlTree { return this.router.createUrlTree(this.link(commands)); }

  tryFixMissingSlugOnLoad(): UrlTree | null {
    const slug = this.getCurrentSlug();
    if (slug) return null;
    const last = this.getLastSlug();
    if (!last) return null;
    const segs = this.doc.location.pathname.split('/').filter(Boolean);
    return this.router.createUrlTree(['/', last, ...segs]);
  }

  getOrigin(): string { return this.doc.location.origin; }
  getAbsoluteUrl(): string { const { origin, pathname } = this.doc.location; return origin + pathname; }

  toAbsoluteUrlForSlug(slug?: string): string {
    const s = this.normalizeKey(slug || this.getSlug());
    return s ? `${this.getOrigin()}/${s}` : `${this.getOrigin()}/`;
  }

  getInstitutionMeta(): TenantMeta {
    const inst = this.getInstitution();
    const name = inst?.name || 'חפץ חסד';
    const title = `${name} – חפץ חסד`;
    const imageAbs = inst?.logo?.startsWith('http')
      ? inst.logo
      : `${this.getOrigin()}/${(inst?.logo || 'assets/logo.png').replace(/^\/+/, '')}`;
    return {
      title,
      description: `מערכת חפץ חסד לניהול גמ"ח ${name}: הלוואות, הפקדות ותרומות.`,
      keywords: `חפץ חסד, גמ"ח, ${name}, הלוואות, הפקדות, תרומות, ניהול גמחים`,
      image: imageAbs
    };
  }
}
