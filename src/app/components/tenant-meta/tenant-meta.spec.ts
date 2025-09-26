import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMeta } from './tenant-meta';

describe('TenantMeta', () => {
  let component: TenantMeta;
  let fixture: ComponentFixture<TenantMeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantMeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantMeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
