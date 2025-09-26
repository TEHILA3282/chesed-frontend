import {
  ApplicationConfig,
  APP_INITIALIZER,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { filter } from 'rxjs';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { InstitutionInterceptor } from './interceptors/institution-interceptor';

import { routes } from './app.routes';
import { NgChartsModule } from 'ng2-charts';

import { ContactService } from './services/contact.service';

import { SeoService } from './services/seo.service';
import { InstitutionService } from './services/institution.service';

function preloadPublicInfoFactory(contact: ContactService) {
  return () => contact.preloadPublicInfo();
}

function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function seoNavInitFactory(router: Router, inst: InstitutionService, seo: SeoService) {
  return () => {
    const apply = () => {
      const meta = inst.getInstitutionMeta();
      const absUrl = inst.getAbsoluteUrl();
      seo.setAll(meta, absUrl);
      seo.setBreadcrumbJsonLd('https://c-chesed.org.il/', null, inst.getInstitution().name, absUrl);
      setCanonical(absUrl);
    };

    apply();

    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(apply);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(NgChartsModule),
    provideHttpClient(
      withInterceptors([
        InstitutionInterceptor,
        AuthInterceptor,
      ])
    ),

    Title,
    Meta,

    {
      provide: APP_INITIALIZER,
      useFactory: preloadPublicInfoFactory,
      deps: [ContactService],
      multi: true
    },

    {
      provide: APP_INITIALIZER,
      useFactory: seoNavInitFactory,
      deps: [Router, InstitutionService, SeoService],
      multi: true
    }
  ]
};
