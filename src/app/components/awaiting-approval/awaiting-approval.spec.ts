import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingApproval } from './awaiting-approval';

describe('AwaitingApproval', () => {
  let component: AwaitingApproval;
  let fixture: ComponentFixture<AwaitingApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwaitingApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwaitingApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
