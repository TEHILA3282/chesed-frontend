import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositWithdraw } from './deposit-withdraw';

describe('DepositWithdraw', () => {
  let component: DepositWithdraw;
  let fixture: ComponentFixture<DepositWithdraw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositWithdraw]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositWithdraw);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
