import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InstitutionService, InstitutionConfig } from '../../services/institution.service';
import { GlobalSearchComponent } from '../global-search/global-search';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    GlobalSearchComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  institution: InstitutionConfig;

  constructor(
    public institutionService: InstitutionService,
    private dialog: MatDialog
  ) {
    this.institution = this.institutionService.getInstitution();
  }

  get logoUrl(): string {
    const logo = this.institution?.logo || 'assets/default-logo.png';
    return logo.startsWith('http')
      ? logo
      : '/' + logo.replace(/^\/+/, '');
  }

  formatInstitutionName(name: string): string {
    const idx = name.indexOf(' ');
    return idx > -1
      ? `${name.slice(0, idx)}<br>${name.slice(idx + 1)}`
      : name;
  }

  openContact(): void {
this.dialog.open(ContactDialogComponent, {
  panelClass: 'contact-dialog-pane',
  backdropClass: 'cc-backdrop',
  autoFocus: false,
  restoreFocus: true,
  width: 'auto',
  maxWidth: '92vw'
});
  }
}
