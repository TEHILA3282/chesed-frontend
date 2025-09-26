import { Component, ViewChild, ViewContainerRef, effect, signal } from '@angular/core';
import { resolveProgramsComponent } from './programs.registry';

@Component({
  selector: 'app-programs-host',
  standalone: true,
  template: `<ng-template #vc></ng-template>`,
})
export class ProgramsHostComponent {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;
  private compSig = signal(resolveProgramsComponent());

  constructor() {
    effect(() => {
      const Cmp = this.compSig();
      this.vc.clear();
      this.vc.createComponent(Cmp);
    });
  }
}
