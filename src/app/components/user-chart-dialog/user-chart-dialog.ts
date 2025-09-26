import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartData, ChartOptions } from 'chart.js';
import { AccountActionsService } from '../../services/account-actions.service';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-chart-dialog',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './user-chart-dialog.html',
  styleUrls: ['./user-chart-dialog.scss']
})
export class UserChartDialogComponent implements OnInit {
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  fullName: string = '';
  isDataReady = false;
  hasData = false;

  constructor(
    private accountService: AccountActionsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, fullName: string }
  ) {}

  ngOnInit(): void {
    this.fullName = this.data.fullName;

    this.accountService.getSummaryByUserId(this.data.userId).subscribe(data => {
      const total = data.totalLoans + data.totalRepayments + data.totalDeposits + data.totalDonations;
      this.hasData = total > 0;

      this.doughnutChartData = {
        labels: ['הלוואות', 'החזרים', 'הפקדות', 'תרומות'],
        datasets: [
          {
            data: [
              data.totalLoans,
              data.totalRepayments,
              data.totalDeposits,
              data.totalDonations
            ],
            backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#facc15'],
            hoverOffset: 14
          }
        ]
      };

      this.isDataReady = true;

      this.cdr.detectChanges();
    });
  }
}
