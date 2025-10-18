import { inject } from '@angular/core';
import { InstitutionService } from '../services/institution.service';
import { ProgramsData } from './programs.model';
import { ChavuratChesedPrograms } from './tenants/chavurat-chesed.programs';
import { ChaiadPrograms } from './tenants/chaiad.programs';
import { hafetzChesedPrograms } from './tenants/hafetzchesed.programs';

export function resolveProgramsData(): ProgramsData {
  const slug = inject(InstitutionService).getSlug();
  const map: Record<string, ProgramsData> = {
    'chavuratchesed': ChavuratChesedPrograms,
    'chaiad': ChaiadPrograms,
  };
  return map[slug] ?? hafetzChesedPrograms;
}
