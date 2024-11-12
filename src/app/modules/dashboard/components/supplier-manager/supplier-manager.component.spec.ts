import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierManagerComponent } from './supplier-manager.component';

describe('SupplierManagerComponent', () => {
  let component: SupplierManagerComponent;
  let fixture: ComponentFixture<SupplierManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
