import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ContactService, InstitutionPublicInfo } from '../../services/contact.service';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './contact-dialog.html',
  styleUrls: ['./contact-dialog.scss']
})
export class ContactDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ContactDialogComponent>);
  private fb = inject(FormBuilder);
  private contact = inject(ContactService);

  info?: InstitutionPublicInfo;
  loading = false;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    subject:   ['', Validators.required],
    message:   ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    if (!this.contact.currentPublicInfo) {
      await this.contact.refreshPublicInfo();
    }
    this.contact.publicInfo$().subscribe((i) => {
      this.info = i ?? undefined;
    });
  }

  // חדש: סגירת הדיאלוג
  close(): void {
    this.dialogRef.close(false);
  }

  // אופציונלי: סגירה ב-Escape
  @HostListener('document:keydown.escape')
  onEsc(): void { this.close(); }

  async onSubmit() {
    if (!this.form.valid || this.loading) return;
    this.loading = true;
    try {
      if (!this.info) {
        await this.contact.refreshPublicInfo();
        this.info = this.contact.currentPublicInfo ?? undefined;
      }
      if (!this.info) return;

      await this.contact.submitContact({
        institutionId: this.info.institutionId,
        ...(this.form.value as any),
      });
      this.dialogRef.close(true);
    } finally {
      this.loading = false;
    }
  }
}
