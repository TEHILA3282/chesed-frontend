import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositType } from '../../services/deposit-type.service';
import { DepositService, CreateDepositDto } from '../../services/deposit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.html',
  styleUrls: ['./deposit.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated, 
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class DepositComponent implements OnInit {
  amount: number | null = null;
  largeString = '';
  depositType: DepositType | null = null;

  depositMethod: 'contact' | 'automatic' | null = null;
  automaticDepositDateChoice: 'immediate' | 'other' | null = null;
  paymentMethod: string | null = null;
  otherDate: Date | null = null;

  isReady = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private depositService: DepositService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!id || isNaN(id)) {
      console.error(`ID שגוי או חסר בנתיב: ${idParam}`);
      this.router.navigate(['/deposit-list']);
      return;
    }

    const allTypes = this.authService.getDepositTypes();
    const found = allTypes.find(t => t.id === id);

    if (!found) {
      console.error(`לא נמצא סוג הפקדה עם id = ${id}`);
      this.router.navigate(['/deposit-list']);
      return;
    }

    this.depositType = found;
    this.isReady = true;
  }

  private toLocalIsoMidnight(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}T00:00:00`;
  }

  onSubmit(form: NgForm) {
    if (!this.depositType) return;

    const nowIsoUtc = new Date().toISOString();

    const chosenLocalMidnight =
      this.automaticDepositDateChoice === 'other' && this.otherDate
        ? this.toLocalIsoMidnight(this.otherDate)
        : null;

    const depositDate: string | null =
      this.depositMethod === 'automatic' && chosenLocalMidnight
        ? chosenLocalMidnight
        : nowIsoUtc;

    const depositReceivedDate: string | null =
      this.depositMethod === 'automatic' && chosenLocalMidnight
        ? chosenLocalMidnight
        : null;

    const normalizedPaymentMethod =
      this.depositMethod === 'automatic' ? (this.paymentMethod || null) : null;

    const payload: CreateDepositDto = {
      depositTypeId: this.depositType.id,
      amount: this.amount !== null ? Number(this.amount) : null,
      purposeDetails: this.largeString?.trim() || '',
      isDirectDeposit: this.depositMethod === 'automatic',
      depositDate,
      depositReceivedDate,
      paymentMethod: normalizedPaymentMethod,
    };

    this.depositService.addDeposit(payload).subscribe({
      next: () => {
        alert('ההפקדה נשלחה בהצלחה!');
        form.resetForm();
        this.amount = null;
        this.largeString = '';
        this.depositMethod = null;
        this.automaticDepositDateChoice = null;
        this.paymentMethod = null;
        this.otherDate = null;
      },
      error: (err: any) => {
        console.error('שגיאה בשליחה:', err);
        const msg =
          err?.error?.detail ||
          err?.error?.title ||
          err?.message ||
          'שגיאה בשליחת ההפקדה';
        alert(msg);
      },
    });
  }
}
