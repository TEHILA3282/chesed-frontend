import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

type GuarantorRow = {
  firstName: string; lastName: string; idNumber: string; phone: string;
  occupation: string; city: string; street: string; houseNumber: string;
  loanLink: string; email: string;
};

type GuarantorDTO = {
  fullName: string;
  idNumber: string;
  phone: string;
  occupation?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  loanLink?: string;
  email?: string;
};

@Component({
  selector: 'app-guarantors-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guarantors-form.html',
  styleUrls: ['./guarantors-form.scss']
})
export class GuarantorsFormComponent {
  @Output() guarantorsChange = new EventEmitter<GuarantorDTO[]>();

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

  get guarantorsArray(): FormArray {
    return this.form.get('guarantors') as FormArray;
  }
  get guarantorFormGroups(): FormGroup[] {
    return this.guarantorsArray.controls as FormGroup[];
  }

  addGuarantor() {
    this.guarantorsArray.push(this.createGuarantor());
    this.emitGuarantors();
  }
  removeGuarantor(i: number) {
    this.guarantorsArray.removeAt(i);
    this.emitGuarantors();
  }

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

  private emitGuarantors() {
    const rows = (this.guarantorsArray.value as GuarantorRow[]);
    const list: GuarantorDTO[] = rows
      .filter(r =>
        !!(r.firstName || r.lastName || r.idNumber || r.phone ||
           r.occupation || r.city || r.street || r.houseNumber ||
           r.loanLink || r.email)
      )
    .map(r => ({
      fullName: `${(r.firstName || '').trim()} ${(r.lastName || '').trim()}`.trim(),
      idNumber: (r.idNumber || '').trim(),
      phone: (r.phone || '').trim(),
      occupation: (r.occupation || '').trim(),
      city: (r.city || '').trim(),
      street: (r.street || '').trim(),
      houseNumber: (r.houseNumber || '').trim(),
      loanLink: (r.loanLink || '').trim(),
      email: (r.email || '').trim(),
    }));
    this.guarantorsChange.emit(list);
  }
}
