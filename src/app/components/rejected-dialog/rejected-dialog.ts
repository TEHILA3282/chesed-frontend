import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rejected-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './rejected-dialog.html',
  styleUrls: ['./rejected-dialog.scss']
})
export class RejectedDialogComponent {
  private dialogRef = inject(MatDialogRef<RejectedDialogComponent>);
  onClose(): void { this.dialogRef.close(); }
}
