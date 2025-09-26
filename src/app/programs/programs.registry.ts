import { Type, inject } from '@angular/core';
import { InstitutionService } from '../services/institution.service';
import { PromoChavuratChesedComponent } from './tenants/chavuratchesed/promo-chavuratchesed/promo-chavuratchesed';

export function resolveProgramsComponent(): Type<any> {
  const instSvc = inject(InstitutionService);
  const slug = instSvc.getSlug();
  const map: Record<string, Type<any>> = {
    chavuratchesed: PromoChavuratChesedComponent,
  };
  return map[slug] ?? PromoChavuratChesedComponent;
}
