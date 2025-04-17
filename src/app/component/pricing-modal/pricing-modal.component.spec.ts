import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingModalComponent } from './pricing-modal.component';

describe('PricingModalComponent', () => {
  let component: PricingModalComponent;
  let fixture: ComponentFixture<PricingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PricingModalComponent]
    });
    fixture = TestBed.createComponent(PricingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
