import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChartDialog } from '../user-chart-dialog';

describe('UserChartDialog', () => {
  let component: UserChartDialog;
  let fixture: ComponentFixture<UserChartDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChartDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChartDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
