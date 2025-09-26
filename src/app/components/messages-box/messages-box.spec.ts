import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesBoxComponent } from './messages-box';


describe('MessagesBox', () => {
  let component: MessagesBoxComponent;
  let fixture: ComponentFixture<MessagesBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
