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
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.depositTypes = this.authService.getDepositTypes();
    this.isLoading = false;
  }

 goToDeposit(deposit: DepositType) {
    const isFreezeByName = (deposit.name || '').trim() ==='בקשה להקפאת תשלומים'
     const isFreezeByNameNumTwo = (deposit.name || '').trim() ==='בקשה למשיכת הפקדה'
   if (isFreezeByName) {
  this.router.navigate(['/payments-freeze'], { queryParams: { type: 'deposit' } });
  return;
}
   if (isFreezeByNameNumTwo) {
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
