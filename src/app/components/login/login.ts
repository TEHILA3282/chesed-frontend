import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ForgotPassword } from '../forgot-password/forgot-password';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { InstitutionService, InstitutionConfig } from '../../services/institution.service';
import { AccountActionsService } from '../../services/account-actions.service';
import { RejectedDialogComponent } from '../rejected-dialog/rejected-dialog';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  hide = true;
  form: FormGroup;
  errorMessage = '';
  loading = false;
  institution!: InstitutionConfig;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public institutionService: InstitutionService,
    private actionsService: AccountActionsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.institution = this.institutionService.getInstitution();
    this.form = this.fb.group({
      emailOrId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // 1) מה-history.state
    const stateUsername = (history.state && history.state.username) ? String(history.state.username) : '';
    // 2) גיבוי: מה-Query Param ?u=
    const qpUsername = this.route.snapshot.queryParamMap.get('u') ?? '';

    const username = stateUsername || qpUsername;
    if (username) {
      this.form.patchValue({ emailOrId: username });
    }

    // מאפסים את ה-state (לא קריטי, אבל שומר על ניקיון)
    try { history.replaceState({}, document.title, location.href); } catch {}

    // מעודד את מנהל הסיסמאות למלא את הסיסמה השמורה
    queueMicrotask(() => (document.getElementById('login-username') as HTMLInputElement | null)?.focus());
  }

  formatInstitutionName(name: string): string {
    if (!name) return '';
    const cleaned = name.replace(/\s+/g, ' ').trim();
    const idx = cleaned.indexOf(' ');
    return idx > -1 ? `${cleaned.slice(0, idx)}<br>${cleaned.slice(idx + 1)}` : cleaned;
  }

  onSubmit() {
    if (this.loading) return;
    this.errorMessage = '';
    this.form.updateValueAndValidity();

    const emailCtrl = this.form.get('emailOrId');
    const passCtrl  = this.form.get('password');

    if (!emailCtrl || !passCtrl || emailCtrl.invalid || passCtrl.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'נא למלא תעודת זהות/מייל וסיסמה';
      return;
    }

    const credentials = {
      emailOrId: emailCtrl.value,
      password:  passCtrl.value,
      institutionId: this.institutionService.getInstitutionId()
    };

    this.loading = true;

    this.authService.login(credentials)
      .pipe(finalize(() => {
        this.ngZone.run(() => { this.loading = false; this.cdr.markForCheck(); });
      }))
      .subscribe({
        next: (res) => {
          if (res?.token) localStorage.setItem('token', res.token);

          const user   = res?.user;
          const role   = user?.role;
          const status = user?.registrationStatus;

          if (status === 'מאושר') {
            this.actionsService.getAllActions().subscribe({
              next: actions => this.authService.setAccountActions(actions),
              error: () => {}
            });

            this.ngZone.run(() =>
              this.router.navigate(
                this.institutionService.link([role === 'Admin' ? 'admin' : 'home']),
                { replaceUrl: true }
              )
            );

          } else if (status === 'ממתין') {
            this.ngZone.run(() =>
              this.router.navigate(this.institutionService.link(['awaiting-approval']), { replaceUrl: true })
            );

          } else if (status === 'נדחה') {
            this.dialog.open(RejectedDialogComponent);

          } else {
            this.errorMessage = 'מצב חשבון לא מוכר.';
          }
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.errorMessage =
              err?.status === 401 ? 'כתובת מייל/ת"ז או סיסמה שגויים'
              : typeof err?.error?.message === 'string' ? err.error.message
              : 'שגיאה בהתחברות. נסו שוב.';
            this.cdr.markForCheck();
          });
        }
      });
  }

  openForgotPassword() {
    this.dialog.open(ForgotPassword, {
      panelClass: 'reset-dialog',
      backdropClass: 'reset-backdrop',
      width: 'auto',
      maxWidth: '100vw',
      height: 'auto',
      maxHeight: '100vh',
      autoFocus: false,
      restoreFocus: false
    });
  }

  getLogoPath(): string {
    const logo = this.institution.logo || '';
    if (/^https?:\/\//i.test(logo)) return logo;
    if (logo.startsWith('assets/')) return logo;
    if (logo.startsWith('/assets')) return logo;
    return `assets/${logo.replace(/^\/+/, '')}`;
  }
}
