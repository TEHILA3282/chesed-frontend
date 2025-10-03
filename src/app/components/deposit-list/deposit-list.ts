import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { DepositType } from '../../services/deposit-type.service';

@Component({
  selector: 'app-deposit-list',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './deposit-list.html',
  styleUrls: ['./deposit-list.scss'],
})
export class DepositListComponent implements OnInit {
  depositTypes: DepositType[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.depositTypes = this.authService.getDepositTypes();
    this.isLoading = false;
  }

  /** trackBy ליציבות DOM וביצועים */
  trackById(index: number, item: DepositType): number | string {
    // אם אין id במודל שלך, החליפי לשם השדה המתאים (DepositTypeId וכד').
    return (item as any).id ?? (item as any).depositTypeId ?? index;
  }

  goToDeposit(deposit: DepositType): void {
    const name = (deposit?.name || '').trim();

    if (name === 'בקשה להקפאת תשלומים') {
      this.router.navigate(['/payments-freeze'], { queryParams: { type: 'deposit' } });
      return;
    }

    if (name === 'בקשה למשיכת הפקדה') {
      this.router.navigate(['/deposit-withdraw'], { queryParams: { type: 'deposit' } });
      return;
    }

    if (!deposit?.id) {
      console.error('ID לא קיים בהפקדה');
      return;
    }

    this.router.navigate(['/deposit', deposit.id]);
  }
}
