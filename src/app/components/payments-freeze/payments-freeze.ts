import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

type FreezeType = 'loan' | 'deposit';

@Component({
  selector: 'app-freeze-request',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './payments-freeze.html',
  styleUrls: ['./payments-freeze.scss']
})
export class FreezeRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  type = signal<FreezeType>('loan');
  loading = signal(false);

  title = computed(() =>
    this.type() === 'deposit'
      ? 'בקשה להקפאת תשלומי הפקדה'
      : 'בקשה להקפאת תשלומי הלוואה'
  );

  subtitle = computed(() =>
    this.type() === 'deposit'
      ? 'מלאו את הפרטים והגישו בקשה להקפאת תשלומי ההפקדה. הבקשה תבדק ותאושר לפי הנהלים'
      : 'מלאו את הפרטים והגישו בקשה להקפאת תשלומי הלוואה. הבקשה תבדק ותאושר לפי הנהלים'
  );

  ackText = computed(() =>
    this.type() === 'deposit'
      ? 'בקשה זו נשלחה 3 ימים קודם יום החיוב. ובאם לא, הרי שאין הקופה אחראית לבקשה זו היות והקפאת שלומים מבוצעים עד 3 ימים ממועד התשלום. (במקרה ונוכל ממש את הבקשה נודיע על כך בהודעה חוזרת)'
      : ' טרם קבל התשובה במערכת מאת הקופה אראה זאת כסרוב הבקשה ואערך בהתאם לגבייה. בהלוואות קופת הגמ"ח תאשר הקפאה של לא יותר מפעמיים בשנה. הקפאה תאושר לפי שיקול דעת ההנהלה'
  );


  requestType = computed<FreezeType>(() => this.type());

  form = this.fb.group({
    reason: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)]
    }),
    acknowledged: this.fb.control(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    })
  });

  ngOnInit(): void {
    const t = (this.route.snapshot.queryParamMap.get('type') ?? 'loan').toLowerCase();
    this.type.set(t === 'deposit' ? 'deposit' as const : 'loan' as const);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;

    const { reason, acknowledged } = this.form.getRawValue();
    const payload = {
      requestType: this.requestType(), 
      reason,
      acknowledged
    };

    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/freeze-requests`, payload).subscribe({
      next: () => {
        this.snack.open('הבקשה נשלחה בהצלחה', 'סגור', { duration: 3000, direction: 'rtl' });
        this.router.navigate(['/performing-actions']);
      },
      error: (err) => {
        console.error(err);
        this.snack.open('אירעה שגיאה בשליחה', 'סגור', { duration: 4000, direction: 'rtl' });
        this.loading.set(false);
      }
    });
  }
}
