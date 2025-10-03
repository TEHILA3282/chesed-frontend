import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { InstitutionService } from '../services/institution.service';

export const InstitutionInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('X-Institution-Id') || req.headers.has('X-Institution-Slug')) {
    return next(req);
  }

  const instSvc = inject(InstitutionService);
  const instId  = instSvc.getInstitutionId();
  const slug    = instSvc.getSlug();


  if (req.url.startsWith('/')) {
    return next(req.clone({
      setHeaders: buildHeaders(instId, slug)
    }));
  }

  try {
    const u   = new URL(req.url);
    const cur = new URL(window.location.href);
    const sameOrigin = (u.origin === cur.origin);

    if (sameOrigin) {
      // לא מגבילים ל-/api; שולחים תמיד למקור שלנו
      return next(req.clone({
        setHeaders: buildHeaders(instId, slug)
      }));
    }
  } catch {
    // אם נכשל פרסינג – לא לעצור את הבקשה
  }

 
  return next(req);
};

function buildHeaders(instId: number, slug?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (instId > 0) headers['X-Institution-Id'] = String(instId); // תמיד!
  if (slug)       headers['X-Institution-Slug'] = slug;         // אופציונלי, בנוסף
  return headers;
}
