import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-status-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule, FormsModule],
  templateUrl: './edit-status-dialog.html',
  styleUrls: ['./edit-status-dialog.scss']
})
export class EditStatusDialogComponent {
  selectedStatus: string;

  constructor(
    public dialogRef: MatDialogRef<EditStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedStatus = data.registrationStatus;
  }

  confirm(): void {
    this.dialogRef.close({ newStatus: this.selectedStatus });
  }

  cancel(): void {
    this.dialogRef.close();
    
  }
}
