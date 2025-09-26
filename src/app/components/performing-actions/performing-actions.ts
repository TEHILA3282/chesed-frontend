import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-performing-actions',
  templateUrl: './performing-actions.html',
  styleUrls: ['./performing-actions.scss'],
  standalone: true,
})
export class PerformingActionsComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
