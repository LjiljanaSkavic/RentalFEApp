import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePasswordModalComponent } from './manage-password-modal.component';

describe('ManagePasswordModalComponent', () => {
  let component: ManagePasswordModalComponent;
  let fixture: ComponentFixture<ManagePasswordModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePasswordModalComponent]
    });
    fixture = TestBed.createComponent(ManagePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
