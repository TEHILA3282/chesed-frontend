import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserChartComponent } from '../user-chart/user-chart';
import { AuthService } from '../../services/auth.service';
import { AccountAction } from '../../services/account-actions.service';

@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.html',
  styleUrls: ['./account-actions.scss'],
  standalone: true,
  imports: [CommonModule, UserChartComponent],
})
export class AccountActionsComponent implements OnInit, AfterViewInit, OnDestroy {
  balanceSummary: AccountAction[] = [];
  recentActions:  AccountAction[] = [];
  showAllRecent = false;

  @ViewChild('gapLine')  gapLineRef!: ElementRef<HTMLDivElement>;
  @ViewChild('bandLine') bandLineRef!: ElementRef<HTMLDivElement>;
  @ViewChild('balancesList') balancesListRef!: ElementRef<HTMLUListElement>;
  @ViewChild('balancesCol') balancesColRef!: ElementRef<HTMLDivElement>;
  @ViewChild('bandBox') bandBoxRef!: ElementRef<HTMLElement>;
  @ViewChild('pageRoot') pageRootRef!: ElementRef<HTMLElement>;

  private removeResize?: () => void;

  constructor(private authService: AuthService, private zone: NgZone) {}

  ngOnInit(): void {
    const all = this.authService.getAccountActions();
    this.balanceSummary = all.filter(a => a.important === 0 || a.important === 1);
    this.recentActions  = all.filter(a => a.important >= 3).slice().reverse();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const onResize = () => this.positionGapLines();
      // הפעלה ראשונית + בעת שינוי גודל
      onResize();
      window.addEventListener('resize', onResize, { passive: true });
      this.removeResize = () => window.removeEventListener('resize', onResize);
    });
  }
  ngOnDestroy(): void { this.removeResize?.(); }

  /** ממקם את ה־spine הכחול (על הלבן) ואת הקטע הלבן על הפס */
  private positionGapLines() {
    const pageEl  = this.pageRootRef?.nativeElement;
    const listEl  = this.balancesListRef?.nativeElement;
    const bandEl  = this.bandBoxRef?.nativeElement;
    const gapLine = this.gapLineRef?.nativeElement;
    const wLine   = this.bandLineRef?.nativeElement;
    if (!pageEl || !listEl || !bandEl || !gapLine || !wLine) return;

    const page = pageEl.getBoundingClientRect();
    const band = bandEl.getBoundingClientRect();

    // אופקי: העוגן הוא הקצה הימני של הפיל האחרון – ממשיך באותו קו
    const lastLi = listEl.lastElementChild as HTMLElement | null;
    if (!lastLi) return;
    const lastRect = lastLi.getBoundingClientRect();

    // אם רוצים להזיז פיקסלים בודדים ימינה/שמאלה – לשנות כאן:
    const DELTA_X = 0; // לדוגמה: 2 או ‎-2
    const desiredX = Math.round(lastRect.right + DELTA_X);
    const leftPx   = Math.max(0, desiredX - page.left);
    gapLine.style.left = `${leftPx}px`;
    wLine.style.left   = `${leftPx}px`;

    // אנכי (כחול): מראש הכדור האחרון ועד תחילת הפס
    const topBlue  = Math.max(0, lastRect.bottom - page.top);
    const hBlue    = Math.max(0, band.top - lastRect.bottom);
    gapLine.style.top    = `${topBlue}px`;
    gapLine.style.height = `${hBlue}px`;

    // אנכי (לבן): קטע קצר על הפס
    const WHITE_LEN = 64; // לכיוונון מול הפיגמה (46/64/84)
    wLine.style.top    = `${Math.max(0, band.top - page.top)}px`;
    wLine.style.height = `${WHITE_LEN}px`;
  }

  get recentVisible(): AccountAction[] {
    return this.showAllRecent ? this.recentActions : this.recentActions.slice(0, 2);
  }
  get hasMoreRecent(): boolean { return (this.recentActions?.length ?? 0) > 2; }
  toggleShowMore(): void { this.showAllRecent = !this.showAllRecent; }

  getClass(important: number): string {
    switch (important) {
      case 3: return 'red';
      case 4: return 'blue';
      case 5: return 'green';
      case 1: return 'bold';
      default: return '';
    }
  }
}
