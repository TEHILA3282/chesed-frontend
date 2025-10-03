import { Component } from '@angular/core';
import { ProgramsShellComponent } from './programs-shell';
import { PROGRAMS_DATA } from './programs.tokens';
import { resolveProgramsData } from './programs.registry';

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [ProgramsShellComponent],
  providers: [{
    provide: PROGRAMS_DATA,
    useFactory: resolveProgramsData,
  }],
  template: `<app-programs-shell />`,
})
export class ProgramsPageComponent {}
