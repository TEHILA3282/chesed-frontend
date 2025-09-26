import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositListComponent } from './deposit-list';
import { RouterTestingModule } from '@angular/router/testing';

describe('DepositListComponent', () => {
  let component: DepositListComponent;
  let fixture: ComponentFixture<DepositListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositListComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render deposit cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.deposit-card').length).toBe(component.depositTypes.length);
  });
});