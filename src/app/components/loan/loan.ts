import { Component, Input, OnInit } from '@angular/core';
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
import { GuarantorsFormComponent } from '../guarantors/guarantors-form/guarantors-form';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-loan',
  templateUrl: './loan.html',
  styleUrls: ['./loan.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatRadioModule, MatButtonModule, MatCheckboxModule,
    GuarantorsFormComponent, MatSnackBarModule 
  ]
})
export class LoanComponent implements OnInit {
  @Input() loanTypeId!: number;
  loanTypeTitle = '';
  subtitleText = '';
  isBridge = false;
  detailsLabel = 'פרט';
  detailsPlaceholder = '';
  detailsHelper = ''; 

  amount: number | null = null;
  paymentsCount: number | null = null;
  loanPurpose = '';
  description = '';
  isForApartment: string = 'no';
  apartmentConfirmed = false;
  guarantors: { idNumber: string; fullName: string; phone: string }[] = [];
onGuarantorsChange(list: { idNumber: string; fullName: string; phone: string }[]) {
  this.guarantors = list;
}
  loanPurposes: string[] = [
    'רכישת דירה', 'חתונה בן / בת', 'בר מצווה / בת מצווה',
    'הרחבת דירה', 'שיפוץ דירה', 'שמחה משפחתית',
    'כיסוי חובות', 'חובות לדירה', 'לימודים'
  ];

  constructor(
    private loanTypeService: LoanTypeService,
    private loansService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loanTypeId = id;

    if (this.loanTypeId) {
      this.loanTypeService.getLoanTypeById(this.loanTypeId).subscribe((type: LoanType) => {
        this.applyUi(type);
      });
    }
  }

  private applyUi(type: LoanType) {
    this.loanTypeTitle = type.name;

    this.isBridge = (type.id === 2);

    this.subtitleText = this.isBridge
      ? 'מלאו את הפרטים באופן מלא והגישו בקשה להלוואת גישור. הבקשה תעבור במיידית לבדיקה ואישור'
      : 'מלאו את הפרטים באופן מלא והגישו בקשה להלוואה בתשלומים. הבקשה תעבור במיידית לבדיקה ואישור';

    if (this.isBridge) {
      this.detailsLabel = 'פרט על מקורות ההחזר הצפויים';
      this.detailsPlaceholder = 'איך תחזיר/י את ההלוואה? תזרים צפוי, מכירת נכס, תאריך קבלת כספים ועוד...';
      this.detailsHelper =
        'בהלוואת גישור קופת הגמ"ח רוצה להבין מאיפה יגיע ההחזר ומתי. נא לפרט בקצרה את מסלול ההחזר ואת הביטחונות (אם יש).';
    } else {
      this.detailsLabel = 'פרט';
      this.detailsPlaceholder = 'נא לפרט את מטרת ההלוואה וכל מידע שיעזור לאשר את הבקשה';
      this.detailsHelper = '';
    }
  }

  onSubmit() {
    if (!this.amount || (!this.isBridge && !this.paymentsCount) || !this.loanPurpose || !this.description) return;

    const payload = {
      loanTypeId: this.loanTypeId,
      amount: this.amount!,
      paymentsCount: this.isBridge ? 1 : this.paymentsCount!,
      loanPurpose: this.loanPurpose,
      description: this.description,
      isForApartment: this.isBridge ? false : this.isForApartment === 'yes',
      apartmentConfirmed: this.isBridge ? false : this.apartmentConfirmed,
      guarantors: this.guarantors
    };
this.loansService.create(payload).subscribe({
  next: res => {
    this.snack.open('הבקשה נשמרה בהצלחה', 'סגור', { duration: 3000, direction: 'rtl' });
    this.router.navigate(['/loans-list']);
  },
  error: err => {
    this.snack.open('אירעה שגיאה בשמירה', 'סגור', { duration: 4000, direction: 'rtl' });
    console.error('שגיאה ביצירת הלוואה', err);
  }
});
  }
}
