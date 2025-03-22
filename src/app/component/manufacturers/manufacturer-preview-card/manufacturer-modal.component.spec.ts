import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerModalComponent } from './manufacturer-modal.component';

describe('ManufacturerPreviewCardComponent', () => {
  let component: ManufacturerModalComponent;
  let fixture: ComponentFixture<ManufacturerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerModalComponent]
    });
    fixture = TestBed.createComponent(ManufacturerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
