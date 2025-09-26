import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedDialog } from './rejected-dialog';

describe('RejectedDialog', () => {
  let component: RejectedDialog;
  let fixture: ComponentFixture<RejectedDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
