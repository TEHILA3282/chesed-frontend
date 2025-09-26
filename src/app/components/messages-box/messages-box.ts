import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../services/message.service';

@Component({
  selector: 'app-messages-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages-box.html',
  styleUrls: ['./messages-box.scss']
})
export class MessagesBoxComponent implements OnInit {
  publicMessages: Message[] = [];
  privateMessages: Message[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const messages = this.authService.getMessages();
    this.publicMessages = messages.filter(m => m.seder === 1);
    this.privateMessages = messages.filter(m => m.seder === 7);
  }

  getClass(important: number): string {
    switch (important) {
      case 1: return 'bold';
      case 3: return 'red';
      case 4: return 'blue';
      case 5: return 'green';
      default: return '';
    }
  }
}
