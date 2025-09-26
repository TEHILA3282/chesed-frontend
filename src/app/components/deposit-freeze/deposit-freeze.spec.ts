import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositFreeze } from './deposit-freeze';

describe('DepositFreeze', () => {
  let component: DepositFreeze;
  let fixture: ComponentFixture<DepositFreeze>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositFreeze]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositFreeze);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
