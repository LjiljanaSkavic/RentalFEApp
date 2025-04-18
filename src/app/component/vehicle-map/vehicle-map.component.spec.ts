import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMapComponent } from './vehicle-map.component';

describe('VehicleMapComponent', () => {
  let component: VehicleMapComponent;
  let fixture: ComponentFixture<VehicleMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleMapComponent]
    });
    fixture = TestBed.createComponent(VehicleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
