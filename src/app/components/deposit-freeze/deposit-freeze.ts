import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deposit-freeze',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit-freeze.html',
  styleUrls: ['./deposit-freeze.scss']
})
export class DepositFreezeComponent {
  requestText: string = '';
  isConfirmed: boolean = false;

  onSubmit() {
    // כאן אפשר להוסיף שליחת הבקשה לשרת
    alert('הבקשה נשלחה לאישור');
  }
}