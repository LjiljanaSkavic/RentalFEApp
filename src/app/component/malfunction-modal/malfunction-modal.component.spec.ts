import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalfunctionModalComponent } from './malfunction-modal.component';

describe('MalfunctionModalComponent', () => {
  let component: MalfunctionModalComponent;
  let fixture: ComponentFixture<MalfunctionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MalfunctionModalComponent]
    });
    fixture = TestBed.createComponent(MalfunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
