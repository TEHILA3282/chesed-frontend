import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfPreviewService {
  private initialized = false;

  private initWorker(pdfjsLib: any) {
    if (this.initialized) return;

    const worker = new Worker(
      new URL('assets/pdf.worker.min.mjs', document.baseURI),
      { type: 'module' }
    );

    pdfjsLib.GlobalWorkerOptions.workerPort = worker;


    this.initialized = true;
  }

  async getFirstPageAsDataUrl(url: string, scale = 1.25): Promise<string> {
    const pdfUrl   = new URL('assets/pdf.mjs', document.baseURI).toString();
    const pdfjsLib = await import(/* @vite-ignore */ pdfUrl); // ESM

    this.initWorker(pdfjsLib);

    const { getDocument } = pdfjsLib as any;

    const loadingTask = getDocument({ url });
    const pdf  = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale } as any);
    const canvas   = document.createElement('canvas');
    const ctx      = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width  = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx as any, viewport: viewport as any } as any).promise;

    // ניקוי משאבים
    page.cleanup && page.cleanup();
    await pdf.destroy();

    return canvas.toDataURL('image/png');
  }
}
