import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { InstitutionService } from '../../../../services/institution.service';
import { PdfPreviewService } from '../../../../services/pdf-preview.service';

type PromoPdfItem = {
  kind: 'pdf';
  title: string;
  blurb?: string;
  src: string;
  thumb?: string;
  preview?: string;
};
type PromoVideoItem = {
  kind: 'video';
  title: string;
  blurb?: string;
  src: string;
};
type PromoItem = PromoPdfItem | PromoVideoItem;

@Component({
  selector: 'app-promo-chavurat-chesed',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './promo-chavuratchesed.html',
  styleUrls: ['./promo-chavuratchesed.scss'],
})
export class PromoChavuratChesedComponent implements OnInit {
  private inst = inject(InstitutionService);
  private pdfPreview = inject(PdfPreviewService);
  private cdr = inject(ChangeDetectorRef);

  // פונקציה קטנה ליצירת נתיב נכס יחסית ל-baseURI
  private asset = (p: string) => new URL(`assets/${p}`, document.baseURI).toString();

  title =
    this.inst.getInstitution().programsTitle ??
    `${this.inst.getInstitution().name} – תוכניות ושותפים`;

  promos: PromoItem[] = [
    {
      kind: 'pdf',
      title: 'פרוספקט חבורת חסד',
      blurb: 'עלון מעוצב להצגת הפעילות והשותפים.',
      src: this.asset('prospect-chavurat-chesed-2.pdf'),
    },
    {
      kind: 'pdf',
      title: 'עלון תורמים',
      blurb: 'מידע לתורמים ומתנדבים.',
      src: this.asset('chavurat/ads/donors-brochure.pdf'),
    },
    {
      kind: 'pdf',
      title: 'עלון הצטרפות',
      blurb: 'כל הפרטים להצטרפות מהירה.',
      src: this.asset('chavurat/ads/join-brochure.pdf'),
    },
    {
      kind: 'video',
      title: 'סרטון פרסומי – חבורת חסד',
      blurb: 'הכירו את חבורת חסד בשתי דקות.',
      src: 'https://www.youtube.com/embed/VIDEO_ID?rel=0',
    },
  ];

  async ngOnInit() {
    for (const p of this.promos) {
      if (p.kind === 'pdf' && !p.thumb) {
        try {
          p.preview = await this.pdfPreview.getFirstPageAsDataUrl(p.src, 1.25);
        } catch (e) {
          console.warn('PDF preview failed:', p.src, e);
        }
      }
    }
    this.cdr.markForCheck();
  }
}
