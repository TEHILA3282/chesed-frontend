import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit(): void {
this.contact.publicInfo$().subscribe((i: InstitutionPublicInfo | null) => {
  this.info = i ?? undefined;
});
  }

  async onSubmit() {
    if (!this.form.valid || !this.info) return;
    this.loading = true;
    try {
      await this.contact.submitContact({
        institutionId: this.info.institutionId,
        ...this.form.value as any
      });
      this.dialogRef.close(true);
    } finally {
      this.loading = false;
    }
  }
}
