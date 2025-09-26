import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDetails } from './update-details';

describe('UpdateDetails', () => {
  let component: UpdateDetails;
  let fixture: ComponentFixture<UpdateDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
