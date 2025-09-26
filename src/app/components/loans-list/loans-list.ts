import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoanType } from '../../services/loan-type.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loans-list.html',
  styleUrls: ['./loans-list.scss']
})
export class LoansListComponent implements OnInit {
  loanTypes: LoanType[] = [];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const cached = this.auth.getLoanTypes();
    if (cached && cached.length) {
      this.loanTypes = cached;
      return;
    }

    this.auth.loanTypes$
      .pipe(filter(list => !!list && list.length > 0), take(1))
      .subscribe(list => { this.loanTypes = list; });
  }

  goToLoan(loan: LoanType) {

    const isFreezeByName = (loan.name || '').trim() ==='בקשה להקפאת תשלומים'
    if (isFreezeByName) {
      this.router.navigate(['/payments-freeze']);
      return;
    }

    this.router.navigate(['/loan', loan.id]);
  }
}
