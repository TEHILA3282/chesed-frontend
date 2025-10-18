import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

type GuarantorRow = {
  firstName: string; lastName: string; idNumber: string; phone: string;
  occupation: string; city: string; street: string; houseNumber: string;
  loanLink: string; email: string;
};

export type GuarantorDTO = {
  idNumber: string | null;
  fullName: string | null;
  phone: string | null;
  occupation?: string | null;
  city?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  loanLink?: string | null;
  email?: string | null;
};

@Component({
  selector: 'app-guarantors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guarantors-form.html',
  styleUrls: ['./guarantors-form.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class GuarantorsFormComponent implements OnChanges {
  @Output() guarantorsChange = new EventEmitter<GuarantorDTO[]>();
  @Input() activeIndex = 0;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      guarantors: this.fb.array([
        this.createGuarantor(),
        this.createGuarantor(),
        this.createGuarantor(),
      ]),
    });

    this.form.valueChanges.subscribe(() => this.emitGuarantors());
    this.emitGuarantors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.activeIndex = Math.max(0, Math.min(2, Number(this.activeIndex) || 0));
    }
  }

  get guarantorsArray(): FormArray { return this.form.get('guarantors') as FormArray; }
  get guarantorFormGroups(): FormGroup[] { return this.guarantorsArray.controls as FormGroup[]; }

  addGuarantor() { this.guarantorsArray.push(this.createGuarantor()); this.emitGuarantors(); }
  removeGuarantor(i: number) { this.guarantorsArray.removeAt(i); this.emitGuarantors(); }

  private createGuarantor(): FormGroup {
    return this.fb.group<GuarantorRow>({
      firstName: this.fb.nonNullable.control(''),
      lastName: this.fb.nonNullable.control(''),
      idNumber: this.fb.nonNullable.control(''),
      phone: this.fb.nonNullable.control(''),
      occupation: this.fb.nonNullable.control(''),
      city: this.fb.nonNullable.control(''),
      street: this.fb.nonNullable.control(''),
      houseNumber: this.fb.nonNullable.control(''),
      loanLink: this.fb.nonNullable.control(''),
      email: this.fb.nonNullable.control(''),
    } as any);
  }

  private toNull(v?: string) { const t = (v ?? '').trim(); return t ? t : null; }

  /** פליטה להורה – שולחות רק שורות שיש בהן משהו (גם חלקי), עם המרות "" → null */
  private emitGuarantors() {
    const rows = (this.guarantorsArray.value as GuarantorRow[]);
    const list: GuarantorDTO[] = rows
      .filter(r =>
        !!(r.firstName || r.lastName || r.idNumber || r.phone ||
           r.occupation || r.city || r.street || r.houseNumber ||
           r.loanLink || r.email))
      .map(r => ({
        idNumber: this.toNull(r.idNumber),
        fullName: this.toNull(`${r.firstName || ''} ${r.lastName || ''}`),
        phone: this.toNull(r.phone),
        occupation: this.toNull(r.occupation),
        city: this.toNull(r.city),
        street: this.toNull(r.street),
        houseNumber: this.toNull(r.houseNumber),
        loanLink: this.toNull(r.loanLink),
        email: this.toNull(r.email),
      }));
    this.guarantorsChange.emit(list);
  }

  /** הזרקת שגיאות ModelState מהשרת לתוך הקונטרולים */
  applyServerErrors(problem: any) {
    if (!problem?.errors) return;
    const errors: Record<string, string[]> = problem.errors;
    const rx = /^Guarantors\[(\d+)\]\.(\w+)$/; // דוגמה: Guarantors[0].Phone

    // ניקוי שגיאות server קיימות
    this.guarantorFormGroups.forEach(g => {
      Object.keys(g.controls).forEach(key => {
        const c = g.get(key);
        if (!c) return;
        const curr = c.errors || {};
        if ('server' in curr) {
          delete curr['server'];
          c.setErrors(Object.keys(curr).length ? curr : null);
        }
      });
    });

    const setServerErr = (group: FormGroup, ctrlName: string, msg: string) => {
      const ctrl = group.get(ctrlName);
      if (!ctrl) return;
      const next = { ...(ctrl.errors || {}), server: msg };
      ctrl.setErrors(next);
      ctrl.markAsTouched();
    };

    Object.entries(errors).forEach(([key, messages]) => {
      const m = (messages && messages.length ? messages[0] : '').trim();
      const match = key.match(rx);
      if (!match) return;
      const idx = +match[1];
      const field = match[2];

      const group = this.guarantorsArray.at(idx) as unknown as FormGroup;
      if (!group) return;

      switch (field) {
        case 'Phone':     setServerErr(group, 'phone', m || 'טלפון ערב לא תקין'); break;
        case 'IdNumber':  setServerErr(group, 'idNumber', m || 'ת״ז ערב לא תקינה'); break;
        case 'FullName':
          setServerErr(group, 'firstName', m || 'שם מלא ערב נדרש');
          setServerErr(group, 'lastName',  m || 'שם מלא ערב נדרש');
          break;
        case 'Occupation': setServerErr(group, 'occupation', m); break;
        case 'City':       setServerErr(group, 'city', m); break;
        case 'Street':     setServerErr(group, 'street', m); break;
        case 'HouseNumber':setServerErr(group, 'houseNumber', m); break;
        case 'LoanLink':   setServerErr(group, 'loanLink', m); break;
        case 'Email':      setServerErr(group, 'email', m); break;
        default: break;
      }
    });
  }
}
