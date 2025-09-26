import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatusDialog } from './edit-status-dialog';

describe('EditStatusDialog', () => {
  let component: EditStatusDialog;
  let fixture: ComponentFixture<EditStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStatusDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStatusDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
