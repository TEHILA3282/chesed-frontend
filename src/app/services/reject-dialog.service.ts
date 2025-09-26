import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RejectedDialogComponent } from '../components/rejected-dialog/rejected-dialog';

@Injectable({ providedIn: 'root' })
export class RejectDialogService {
  private dialog = inject(MatDialog);
  private ref: MatDialogRef<RejectedDialogComponent> | null = null;

  openOnce(): void {
    if (this.ref) return;
    this.ref = this.dialog.open(RejectedDialogComponent, {
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });
    this.ref.afterClosed().subscribe(() => this.ref = null);
  }
}
