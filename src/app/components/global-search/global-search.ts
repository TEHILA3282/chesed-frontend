import {
  Component, ElementRef, HostListener, OnDestroy,
  Inject, Renderer2, NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchService, SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './global-search.html',
  styleUrls: ['./global-search.scss']
})
export class GlobalSearchComponent implements OnDestroy {
  searchTerm = '';
  results: SearchResult[] = [];
  placeholder = 'מה תרצה לחפש היום?';
  private isOpen = false; // מצב נוכחי של dropdown

  constructor(
    private router: Router,
    private searchService: SearchService,
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** מוסיף/מסיר class ל-<body> רק כשנדרש */
  private setBodyHasResults(open: boolean): void {
    if (this.isOpen === open) return;
    this.isOpen = open;
    const body = this.document.body;
    if (open) this.renderer.addClass(body, 'has-results');
    else this.renderer.removeClass(body, 'has-results');
  }

  /** מבצע את הטוגל אחרי שה-*ngIf כבר עדכן את ה-DOM */
  private toggleAfterRender(open: boolean): void {
    Promise.resolve().then(() => this.setBodyHasResults(open));
  }

  /** הקלדה – מביא הצעות ל-dropdown */
  onInputChange(): void {
    const term = this.searchTerm.trim();
    if (!term) { this.results = []; this.toggleAfterRender(false); return; }

    this.searchService.suggest(term).subscribe({
      next: (res) => { this.results = res ?? []; this.toggleAfterRender(this.results.length > 0); },
      error: () => { this.results = []; this.toggleAfterRender(false); }
    });
  }

  /** חיפוש מלא (Enter/כפתור) */
  onSearch(): void {
    const term = this.searchTerm.trim();
    if (!term) { this.clearResults(); return; }
    this.router.navigate(['/search'], { queryParams: { q: term } });
    this.clearResults();
  }

  /** ניווט מתוצאה */
  navigateTo(result: SearchResult): void {
    const isLoggedIn = !!localStorage.getItem('token');
    const target = isLoggedIn ? result.route : '/login';
    this.router.navigate(Array.isArray(target) ? target : [target]);
    this.clearResults();
  }

  /** סגירה בלחיצה מחוץ וב-Esc */
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.el.nativeElement.contains(ev.target as Node)) this.clearResults();
  }
  @HostListener('document:keydown.escape') onEsc(): void { this.clearResults(); }

  private clearResults(): void {
    this.results = [];
    this.toggleAfterRender(false);
  }

  ngOnDestroy(): void { this.setBodyHasResults(false); }
}
