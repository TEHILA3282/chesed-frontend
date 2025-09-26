import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword {
  emailOrUser = '';
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPassword>,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  sendResetLink() {
    const identifier = this.emailOrUser.trim();
    if (!identifier) {
      this.snackBar.open('יש להזין אימייל או ת״ז', 'סגור', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.http.post<{ message: string }>(
      `${environment.apiUrl}/auth/forgot-password`,
      { identifier } 
    ).subscribe({
      next: (res) => {
        this.snackBar.open(res?.message || 'סיסמה זמנית נשלחה למייל', 'סגור', { duration: 4000 });
        this.dialogRef.close(true);
        this.isLoading = false;
      },
      error: (err) => {
        const msg =
          err?.status === 404
            ? 'המשתמש לא נמצא במוסד הנוכחי'
            : (err?.error?.message || 'שגיאה בשליחת הסיסמה');
        this.snackBar.open(msg, 'סגור', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
