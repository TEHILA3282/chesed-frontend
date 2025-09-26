import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositWithdrawService } from '../../services/deposit-withdraw.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-deposit-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit-withdraw.html',
  styleUrls: ['./deposit-withdraw.scss']
})
export class DepositWithdrawComponent {
  amount: number | null = null;
  requestText = '';
  loading = false;

  constructor(private api: DepositWithdrawService) {}

  onSubmit(form: NgForm) {
      if (form.invalid) return;
    if (!this.amount || !this.requestText.trim() || this.loading) return;
    this.loading = true;
    this.api.create({ amount: this.amount, requestText: this.requestText.trim() })
      .subscribe({
        next: _ => {
          alert('הבקשה נשלחה בהצלחה');
            form.resetForm();
        },
        error: err => alert(err?.error || 'שגיאה בשליחה'),
        complete: () => this.loading = false
      });
  }
}
