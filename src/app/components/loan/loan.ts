import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanTypeService, LoanType } from '../../services/loan-type.service';
import { LoansService } from '../../services/loans.service';
import {
  GuarantorsFormComponent,
  GuarantorDTO
} from '../guarantors/guarantors-form/guarantors-form';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.html',
  styleUrls: ['./loan.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    GuarantorsFormComponent,
    MatSnackBarModule
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoanComponent implements OnInit {
  @Input() loanTypeId!: number;

  // חיבור לרכיב הערבים – לשם הזרקת שגיאות מהשרת
  @ViewChild(GuarantorsFormComponent) guarantorsCmp?: GuarantorsFormComponent;

  loanTypeTitle = '';
  subtitleText = '';
  isBridge = false; // הלוואת גישור
  detailsLabel = 'פרט';
  detailsPlaceholder = '';
  detailsHelper = '';

  amount: number | null = null;
  paymentsCount: number | null = null;
  loanPurpose = '';
  description = '';

  isForApartment: string = 'no';
  apartmentConfirmed = false;

  guarantors: GuarantorDTO[] = [];

  loanPurposes: string[] = [
    'רכישת דירה',
    'חתונה בן / בת',
    'בר מצווה / בת מצווה',
    'הרחבת דירה',
    'שיפוץ דירה',
    'שמחה משפחתית',
    'כיסוי חובות',
    'חובות לדירה',
    'לימודים'
  ];

  constructor(
    private loanTypeService: LoanTypeService,
    private loansService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // קבלת מזהה וסוג הלוואה מניווט/ראוט
    const nav = this.router.getCurrentNavigation()?.extras?.state as
      | { id?: number; name?: string }
      | undefined;
    const state = nav || (history.state as { id?: number; name?: string } | undefined);

    this.loanTypeId = state?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.loanTypeTitle = state?.name ?? '';

    // להציג טקסטים מיידית
    this.isBridge = this.loanTypeId === 2;
    this.applyTexts();

    // לוודא שם מעודכן מהשרת
    this.fetchType();
  }

  private fetchType() {
    if (!this.loanTypeId) return;
    this.loanTypeService.getLoanTypeById(this.loanTypeId).subscribe({
      next: (type: LoanType) => {
        this.loanTypeTitle = type.name;
        this.isBridge = type.id === 2;
        this.applyTexts();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('❌ שגיאה בטעינת סוג הלוואה:', err)
    });
  }

  private applyTexts() {
    if (this.isBridge) {
      this.subtitleText = 'מלאו את הפרטים להלוואת גישור. הבקשה תעבור לבדיקה ואישור.';
      this.detailsLabel = 'פרט על מקורות ההחזר הצפויים';
      this.detailsPlaceholder =
        'כיצד תחזיר/י את ההלוואה? תזרים, מכירת נכס, קבלת כספים וכו׳...';
      this.detailsHelper = 'בהלוואת גישור חשוב להבין מאיפה ומתי יגיע ההחזר.';
      this.paymentsCount = 1; // גישור – תשלום אחד
    } else {
      this.subtitleText = 'מלאו את הפרטים להלוואה בתשלומים. הבקשה תיבדק לאישור.';
      this.detailsLabel = 'פרט';
      this.detailsPlaceholder =
        'נא לפרט את מטרת ההלוואה וכל מידע שיעזור לאשר את הבקשה';
      this.detailsHelper = '';
      this.paymentsCount = null;
    }
  }

  onGuarantorsChange(list: GuarantorDTO[]) {
    // מגיע כבר עם ""→null וסינון שורות ריקות מה-child
    this.guarantors = Array.isArray(list) ? list : [];
  }

  onSubmit() {
    // ולידציה בסיסית של ההורה
    if (!this.amount || (!this.isBridge && !this.paymentsCount) || !this.loanPurpose || !this.description) {
      this.snack.open('נא למלא את כל השדות הדרושים לפני שליחה', 'סגור', {
        duration: 3000,
        direction: 'rtl'
      });
      return;
    }

    const payload = {
      loanTypeId: this.loanTypeId,
      amount: this.amount!,
      paymentsCount: this.isBridge ? 1 : this.paymentsCount!,
      loanPurpose: this.loanPurpose,
      description: this.description,
      isForApartment: this.isForApartment === 'yes',
      apartmentConfirmed: this.isForApartment === 'yes' ? this.apartmentConfirmed : false,
      guarantors: this.guarantors
    };

    this.loansService.create(payload).subscribe({
      next: (_) => {
        this.snack.open('הבקשה נשמרה בהצלחה', 'סגור', {
          duration: 3000,
          direction: 'rtl'
        });
        this.router.navigate(['/loans-list']);
      },
      error: (err) => {
        // תצוגת הודעות מהשרת בתוך הטופס – 400 בלבד
        if (err?.status === 400 && err?.error) {
          // הזרקת שגיאות ModelState לתוך רכיב הערבים
          this.guarantorsCmp?.applyServerErrors(err.error);

          // טוסט מסכם קצר (לא חובה, נחמד ל־UX)
          const errors = err.error?.errors as Record<string, string[]> | undefined;
          const flat = errors ? Object.values(errors).flat() : [];
          const msg = flat.length ? flat.slice(0, 3).join(' | ') : 'נתונים לא תקינים';
          this.snack.open(msg, 'סגור', { duration: 5000, direction: 'rtl' });
        } else {
          this.snack.open('אירעה שגיאה בשמירה', 'סגור', {
            duration: 4000,
            direction: 'rtl'
          });
        }
        console.error('❌ שגיאה ביצירת הלוואה:', err);
      }
    });
  }
}
