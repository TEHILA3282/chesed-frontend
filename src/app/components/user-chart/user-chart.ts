import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { AuthService } from '../../services/auth.service';

type Mini = { label: string; data: ChartData<'doughnut'> };

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './user-chart.html',
  styleUrls: ['./user-chart.scss'],
})
export class UserChartComponent implements OnInit {
  private readonly BLUE = '#192A4A';
  private readonly RING = '#D9D9D9';

  private readonly CUTOUT = '38%';   

  minis: Mini[] = [
    { label: 'הלוואות', data: this.emptyMini() },
    { label: 'הפקדות', data: this.emptyMini() },
    { label: 'החזרים', data: this.emptyMini() },
    { label: 'תרומות', data: this.emptyMini() },
  ];

  miniOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: this.CUTOUT,
    rotation: -90,
    circumference: 360,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    layout: { padding: 2 }, // נגיעה של פדינג כדי שלא יחתך בקצה
    elements: {
      arc: {
        borderWidth: 0, // בלי מסגרת לבנה
      }
    }
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserSummary().subscribe(summary => {
      if (!summary) return;

      const loans      = Math.max(0, summary.totalLoans ?? 0);
      const deposits   = Math.max(0, summary.totalDeposits ?? 0);
      const repayments = Math.max(0, summary.totalRepayments ?? 0);
      const donations  = Math.max(0, summary.totalDonations ?? 0);
      const total = loans + deposits + repayments + donations;

      const build = (val: number): ChartData<'doughnut'> => {
        if (total <= 0) {
          return { datasets: [{ data: [0, 1], backgroundColor: [this.BLUE, this.RING] }] };
        }
        const rest = Math.max(0, total - val);
        return {
          datasets: [{
            data: [val, rest],
            backgroundColor: [this.BLUE, this.RING],
            hoverBackgroundColor: [this.BLUE, this.RING],
            spacing: 0,
            borderWidth: 0,
          }]
        };
      };

      this.minis = [
        { label: 'הלוואות', data: build(loans) },
        { label: 'הפקדות', data: build(deposits) },
        { label: 'החזרים', data: build(repayments) },
        { label: 'תרומות', data: build(donations) },
      ];
    });
  }

  private emptyMini(): ChartData<'doughnut'> {
    return {
      datasets: [{
        data: [0, 1],
        backgroundColor: [this.BLUE, this.RING],
        borderWidth: 0,
      }]
    };
  }
}
