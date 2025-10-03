import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-performing-actions',
  templateUrl: './performing-actions.html',
  styleUrls: ['./performing-actions.scss'],
  standalone: true,
  imports: [RouterModule], // מאפשר להשתמש ב-[routerLink] אם תרצי
})
export class PerformingActionsComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  /** מביא את ה-slug אם המסך נטען תחת "/:slug/..." */
  private getSlug(): string | null {
    return this.route.parent?.snapshot.paramMap.get('slug') ?? null;
  }

  /** בונה נתיב מוחלט, עם slug אם צריך */
  buildUrl(path: string): string {
    const clean = path.replace(/^\//, '');
    const slug = this.getSlug();
    return slug ? `/${slug}/${clean}` : `/${clean}`;
  }

  /** ניווט בטוח (שומר על slug) */
  navigateTo(path: string) {
    this.router.navigateByUrl(this.buildUrl(path));
  }
}
