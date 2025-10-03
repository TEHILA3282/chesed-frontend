import { inject } from '@angular/core';
import { InstitutionService } from '../services/institution.service';
import { ProgramsData } from './programs.model';
import { ChavuratChesedPrograms } from './tenants/chavurat-chesed.programs';

export function resolveProgramsData(): ProgramsData {
  const slug = inject(InstitutionService).getSlug();
  const map: Record<string, ProgramsData> = {
    'chavuratchesed': ChavuratChesedPrograms,
  };
  return map[slug] ?? ChavuratChesedPrograms;
}
