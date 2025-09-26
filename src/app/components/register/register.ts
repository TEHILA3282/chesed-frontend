import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule,
  AbstractControl, ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {
  RegistrationService,
  RegistrationCreateDto
} from '../../services/registration.service';
import { InstitutionService, InstitutionConfig } from '../../services/institution.service';

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
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', hideRequiredMarker: false } }
  ]
})
export class Register {
  form: FormGroup;
  statuses = ['רווק/ה', 'נשוי/ה', 'גרוש/ה', 'אלמן/ה'];
  errorMessage = '';
  institution: InstitutionConfig;

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
      PhoneNumber:   ['', [Validators.pattern(/^\d{9}$/)]],
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

    // חשוב: כשמשנים סיסמה – מעדכנים את אימות הסיסמה, כדי שהכפתור ישתחרר כשצריך
    this.form.get('Password')?.valueChanges.subscribe(() => {
      this.form.get('ConfirmPassword')?.updateValueAndValidity({ onlySelf: true });
    });

    this.form.reset({
      Role: 'User',
      RegistrationStatus: 'ממתין',
      StatusUpdatedAt: new Date(),
      InstitutionId: institutionId
    });
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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const payload: RegistrationCreateDto = {
      ID: v.ID,
      Email: v.Email,
      Password: v.Password,
      FirstName: v.FirstName || undefined,
      LastName: v.LastName || undefined,
      PhoneNumber: v.PhoneNumber || undefined,
      LandlineNumber: v.LandlineNumber || undefined,
      DateOfBirth: v.DateOfBirth ? new Date(v.DateOfBirth).toISOString().slice(0, 10) : undefined,
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
            next: () => this.router.navigate(this.institutionService.link(['login'])),
            error: () => this.errorMessage = 'ארעה שגיאה במהלך ההרשמה'
          });
        },
        error: () => this.errorMessage = 'שגיאה בבדיקת תקינות המידע'
      });
  }
}
