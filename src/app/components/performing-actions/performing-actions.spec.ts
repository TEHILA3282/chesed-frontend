import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformingActionsComponent } from './performing-actions';

describe('PerformingActionsComponent', () => {
  let component: PerformingActionsComponent;
  let fixture: ComponentFixture<PerformingActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformingActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformingActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
