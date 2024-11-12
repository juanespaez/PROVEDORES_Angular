import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEvaluationComponent } from './supplier-evaluation.component';

describe('SupplierEvaluationComponent', () => {
  let component: SupplierEvaluationComponent;
  let fixture: ComponentFixture<SupplierEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
