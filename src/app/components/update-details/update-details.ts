import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-update-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './update-details.html',
  styleUrls: ['./update-details.scss']
})
export class UpdateDetailsComponent implements OnInit {
  personalStatuses: string[] = ['רווק/ה', 'נשוי/ה', 'גרוש/ה', 'אלמן/ה'];

  detailsForm!: FormGroup;
  bankForm!: FormGroup;

  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}


  private parseDateOnly(s: string): Date {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) {
      const y = +m[1], mm = +m[2] - 1, d = +m[3];
      return new Date(y, mm, d);
    }
    return new Date(s);
  }

  private toLocalIsoMidnight(d: Date | string): string | null {
    if (!d) return null as any;
    const dd = d instanceof Date ? d : this.parseDateOnly(d);
    if (isNaN(dd.getTime())) return null;
    const y = dd.getFullYear();
    const m = String(dd.getMonth() + 1).padStart(2, '0');
    const day = String(dd.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}T00:00:00`; 
  }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      landlineNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [''],
      personalStatus: [''],
      street: [''],
      city: [''],
      houseNumber: ['']
    });

    this.bankForm = this.fb.group({
      bankNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{2,3}$/)]],
      branchNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{1,5}$/)]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
      accountOwnerName: ['', [Validators.required, Validators.minLength(2)]],
      hasDirectDebit: [false]
    });

    this.http.get<any>(`${this.apiUrl}/auth/get-current-user`).subscribe({
      next: u => this.detailsForm.patchValue({
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        phoneNumber: u.phone ?? '',
        landlineNumber: u.phone2 ?? '',
        email: u.email ?? '',
        city: u.city ?? '',
        street: u.street ?? '',
        houseNumber: u.houseNumber ?? '',
        personalStatus: ['רווק/ה','נשוי/ה','גרוש/ה','אלמן/ה'][u.maritalStatus ?? 0] ?? '',
        dateOfBirth: u.birthDate ? this.parseDateOnly(u.birthDate) : ''
      }),
      error: err => {
        console.error('שגיאה בטעינת נתוני משתמש:', err);
        this.snackBar.open('שגיאה בטעינת נתונים', '', { duration: 3000 });
      }
    });

    this.http.get<any>(`${this.apiUrl}/auth/get-bank-details`).subscribe({
      next: data => this.bankForm.patchValue({
        bankNumber: data.bankNumber,
        branchNumber: data.branchNumber,
        accountNumber: data.accountNumber,
        accountOwnerName: data.accountOwnerName,
        hasDirectDebit: data.hasDirectDebit
      }),
      error: err => {
        console.warn('לא נמצאו פרטי חשבון בנק:', err);
      }
    });
  }

  private toRegistrationUpdateDto(): any {
    const v = this.detailsForm.value;
    return {
      FirstName: v.firstName?.trim() || null,
      LastName: v.lastName?.trim() || null,
      Email: v.email?.trim() || null,
      PhoneNumber: v.phoneNumber ? String(v.phoneNumber).trim() : null,
      LandlineNumber: v.landlineNumber ? String(v.landlineNumber).trim() : null,
      City: v.city?.trim() || null,
      Street: v.street?.trim() || null,
      HouseNumber: (v.houseNumber !== '' && v.houseNumber != null)
        ? String(v.houseNumber).trim()
        : null,
      PersonalStatus: v.personalStatus || null,
      DateOfBirth: v.dateOfBirth ? this.toLocalIsoMidnight(v.dateOfBirth) : null
    };
  }

  submit(): void {
    if (!this.detailsForm.valid) {
      this.snackBar.open('יש למלא את כל השדות החובה', '', { duration: 3000 });
      this.detailsForm.markAllAsTouched();
      return;
    }

    const dto = this.toRegistrationUpdateDto();
    this.http.put(`${this.apiUrl}/registration/update-personal`, dto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    })
    .subscribe({
      next: (txt) => this.snackBar.open(txt || 'הפרטים עודכנו בהצלחה', '', { duration: 3000 }),
      error: (err) => {
        if (err.status === 409) {
          this.detailsForm.get('email')?.setErrors({ emailTaken: true });
          this.detailsForm.get('email')?.markAsTouched();
          const msg = err?.error ?? 'האימייל כבר קיים במוסד';
          this.snackBar.open(msg, '', { duration: 3000 });
        } else if (err.status === 400 && err.error) {
          console.error('Validation error:', err.error);
          this.snackBar.open(typeof err.error === 'string' ? err.error : 'נתונים לא תקינים. בדקי את השדות', '', { duration: 3500 });
        } else {
          console.error('שגיאה בעדכון:', err);
          this.snackBar.open('שגיאה בעדכון', '', { duration: 3000 });
        }
      }
    });
  }

  submitBank(): void {
    if (!this.bankForm.valid) {
      this.snackBar.open('בדקי את פרטי החשבון', '', { duration: 3000 });
      return;
    }

    this.http.put(`${this.apiUrl}/registration/update-bank`, this.bankForm.value, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    })
    .subscribe({
      next: (txt) => this.snackBar.open(txt || 'פרטי הבנק עודכנו בהצלחה', '', { duration: 3000 }),
      error: err => {
        console.error('שגיאה בעדכון בנק:', err);
        this.snackBar.open('שגיאה בעדכון', '', { duration: 3000 });
      }
    });
  }
}
