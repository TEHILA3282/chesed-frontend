import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { InstitutionService } from '../services/institution.service';

export const InstitutionInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('X-Institution-Id') || req.headers.has('X-Institution-Slug')) {
    return next(req);
  }

  const instSvc = inject(InstitutionService);
  const instId = instSvc.getInstitutionId();
  const slug = instSvc.getSlug();

  const isRelative = req.url.startsWith('/');
  let sameOriginApi = false;

  if (isRelative) {
    sameOriginApi = req.url.startsWith('/api');
  } else {
    try {
      const u = new URL(req.url);
      const cur = new URL(window.location.href);
      sameOriginApi = (u.origin === cur.origin) && u.pathname.startsWith('/api');
    } catch {
      sameOriginApi = false;
    }
  }

  if (!sameOriginApi) {
    return next(req); 
  }

  const headers: Record<string, string> = {};
  if (slug) headers['X-Institution-Slug'] = slug;
  if (!headers['X-Institution-Slug'] && instId > 0) headers['X-Institution-Id'] = String(instId);

  return next(req.clone({ setHeaders: headers }));
};
