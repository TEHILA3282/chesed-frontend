import { Component, inject, signal, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { PROGRAMS_DATA } from './programs.tokens';
import { ProgramsData, PromoItem } from './programs.model';

@Component({
  selector: 'app-programs-shell',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './programs-shell.html',
  styleUrls: ['./programs-shell.scss'],
})
export class ProgramsShellComponent implements OnInit {
  private data = inject<ProgramsData>(PROGRAMS_DATA);

  title = signal(this.data.meta.title);
  subtitle = signal(this.data.meta.subtitle ?? '');
  items = signal<PromoItem[]>(this.data.items);

  ngOnInit() {}
}
