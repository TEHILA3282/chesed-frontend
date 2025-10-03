import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.prod';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (!/^https?:\/\//i.test(req.url)) {
    const clean = req.url.replace(/^\/+/, '');
    req = req.clone({ url: `${environment.apiUrl}/${clean}` });
  }
  return next(req);
};
