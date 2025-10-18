import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule,
  AbstractControl, ValidationErrors,
} from '@angular/forms';
import {
  CommonModule, formatDate, registerLocaleData
} from '@angular/common';
import localeHe from '@angular/common/locales/he';

import { AuthService } from '../../services/auth.service';

import {
  MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerModule
} from '@angular/material/datepicker';
import {
  MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS,
  MAT_DATE_LOCALE, NativeDateAdapter
} from '@angular/material/core';

import {
  RegistrationService, RegistrationCreateDto
} from '../../services/registration.service';
import { InstitutionService, InstitutionConfig } from '../../services/institution.service';


registerLocaleData(localeHe);


class HeIlDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number { return 0; } 
  override parse(value: any): Date | null {
    if (value instanceof Date && !isNaN(value.getTime())) return value;

    if (typeof value === 'string') {
      const t = value.replace(/\u200e|\u200f/g, '').trim();

      // yyyy-MM-dd
      let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
      if (m) return this._make(+m[1], +m[2], +m[3]);

      // dd/MM/yyyy או dd.MM.yyyy או dd-MM-yyyy
      m = /^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})$/.exec(t);
      if (m) return this._make(+m[3], +m[2], +m[1]);

      // d/M/yy → נניח 19xx/20xx בצורה חכמה (00–49 => 2000+, 50–99 => 1900+)
      m = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/.exec(t);
      if (m) {
        const d = +m[1], mo = +m[2], yy = +m[3];
        const y = yy <= 49 ? 2000 + yy : 1900 + yy;
        return this._make(y, mo, d);
      }
    }
    return null;
  }

  override format(date: Date, displayFormat: any): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private _make(y: number, m: number, d: number): Date | null {
    if (y < 1900 || y > 2100) return null;
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > 31) return null;
    const dt = new Date(y, m - 1, d);
    return (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) ? dt : null;
  }
}

export const HE_IL_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', hideRequiredMarker: false } },
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' },
    { provide: DateAdapter, useClass: HeIlDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: HE_IL_DATE_FORMATS },
  ]
})
export class Register {
  form: FormGroup;
  statuses = ['רווק/ה', 'נשוי/ה', 'גרוש/ה', 'אלמן/ה'];
  errorMessage = '';
  institution: InstitutionConfig;

  // toggles לעין
  hidePassword = true;
  hideConfirm  = true;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router,
    private institutionService: InstitutionService
  ) {
    this.institution = this.institutionService.getInstitution();
    const institutionId = this.institution.id;

    this.form = this.fb.group({
      FirstName: ['', [Validators.required, Validators.pattern(/^[\u0590-\u05FFa-zA-Z\s'-]{2,}$/)]],
      LastName:  ['', [Validators.required, Validators.pattern(/^[\u0590-\u05FFa-zA-Z\s'-]{2,}$/)]],
      ID:        ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
      PhoneNumber:   ['', [Validators.pattern(/^\d{9,10}$/)]],
      LandlineNumber:['', [Validators.pattern(/^\d{10}$/)]],
      Email:     ['', [Validators.required, Validators.email]],
      Role:      ['User'],
      DateOfBirth: [null, [this.noFutureDateValidator]],
      PersonalStatus: ['', Validators.required],
      City:       ['', [Validators.required, Validators.pattern(/^[\u0590-\u05FFa-zA-Z\s'-]+$/)]],
      Street:     ['', [Validators.required, Validators.pattern(/^[\u0590-\u05FFa-zA-Z0-9\s'"\-.,]+$/)]],
      HouseNumber: ['', [Validators.required, Validators.pattern(/^\d+[א-ת]?[a-zA-Z]?$/)]],
      Password:   ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      ConfirmPassword: ['', Validators.required],
      RegistrationStatus: ['ממתין'],
      StatusUpdatedAt: [new Date()],
      InstitutionId: [institutionId]
    }, { validators: this.passwordsMatchValidator });

    this.form.get('Password')?.valueChanges.subscribe(() => {
      this.form.get('ConfirmPassword')?.updateValueAndValidity({ onlySelf: true });
      this.form.updateValueAndValidity();
    });
    this.form.get('ConfirmPassword')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });

    this.form.reset({
      Role: 'User',
      RegistrationStatus: 'ממתין',
      StatusUpdatedAt: new Date(),
      InstitutionId: institutionId,
      PersonalStatus: ''
    });
  }

  /** הקלדה חופשית – נרמול */
  normalizeDobFromText(ev: FocusEvent) {
    const input = ev.target as HTMLInputElement;
    const text  = (input?.value || '').trim();
    if (!text) return;

    const d = this.parseFreeDate(text);
    if (d) {
      this.form.get('DateOfBirth')?.setValue(d);
      this.form.get('DateOfBirth')?.updateValueAndValidity();
    } else {
      this.form.get('DateOfBirth')?.setValue(null);
      this.form.get('DateOfBirth')?.updateValueAndValidity();
    }
  }

  /** בחירה מה-Datepicker */
  normalizeDobFromPicker(ev: any) {
    const d: Date | null = ev?.value ? new Date(ev.value) : null;
    this.form.get('DateOfBirth')?.setValue(d);
    this.form.get('DateOfBirth')?.updateValueAndValidity();
  }

  private parseFreeDate(text: string): Date | null {
    const t = text.replace(/\u200e|\u200f/g, '').trim();

    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
    if (m) return this.makeDate(+m[1], +m[2], +m[3]);

    m = /^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})$/.exec(t);
    if (m) return this.makeDate(+m[3], +m[2], +m[1]);

    m = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/.exec(t);
    if (m) {
      const d = +m[1], mo = +m[2], yy = +m[3];
      const y = yy <= 49 ? 2000 + yy : 1900 + yy;
      return this.makeDate(y, mo, d);
    }

    return null;
  }

  private makeDate(y: number, m: number, d: number): Date | null {
    if (y < 1900 || y > 2100) return null;
    if (m < 1 || m > 12) return null;
    if (d < 1 || d > 31) return null;
    const dt = new Date(y, m - 1, d);
    return (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) ? dt : null;
  }

  noFutureDateValidator = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) return null;
    const inputDate = new Date(v);
    const today = new Date();
    inputDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return inputDate > today ? { futureDate: true } : null;
  };

  passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('Password')?.value;
    const confirm  = group.get('ConfirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  };

  private trimFields(v: any): any {
    const r = { ...v };
    ['FirstName','LastName','Email','City','Street','HouseNumber'].forEach(k => {
      if (typeof r[k] === 'string') r[k] = r[k].trim();
    });
    return r;
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.trimFields(this.form.value);

    // שמירה לשרת תמיד בפורמט ISO יומי 'yyyy-MM-dd'
    let birth: string | undefined = undefined;
    if (v.DateOfBirth instanceof Date && !isNaN(v.DateOfBirth.getTime())) {
      birth = formatDate(v.DateOfBirth, 'yyyy-MM-dd', 'he-IL');
    }

    const payload: RegistrationCreateDto = {
      ID: v.ID,
      Email: v.Email,
      Password: v.Password,
      FirstName: v.FirstName || undefined,
      LastName: v.LastName || undefined,
      PhoneNumber: v.PhoneNumber || undefined,
      LandlineNumber: v.LandlineNumber || undefined,
      DateOfBirth: birth,
      PersonalStatus: v.PersonalStatus || undefined,
      Street: v.Street || undefined,
      City: v.City || undefined,
      HouseNumber: v.HouseNumber || undefined
    };

    this.registrationService.checkEmailOrIdExists(payload.Email, payload.ID, this.institution.id)
      .subscribe({
        next: (exists: boolean) => {
          if (exists) { this.errorMessage = 'משתמש עם כתובת מייל או תעודת זהות זו כבר קיים במערכת'; return; }

          this.registrationService.register(payload).subscribe({
            next: () => {
              const username = payload.ID || payload.Email;
              this.router.navigate(
                this.institutionService.link(['login']),
                { state: { username } }
              );
            },
            error: () => this.errorMessage = 'ארעה שגיאה במהלך ההרשמה'
          });
        },
        error: () => this.errorMessage = 'שגיאה בבדיקת תקינות המידע'
      });
  }
}
