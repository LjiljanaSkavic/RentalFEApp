import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDetailsModalComponent } from './profile-details-modal.component';

describe('ProfileDetailsComponent', () => {
  let component: ProfileDetailsModalComponent;
  let fixture: ComponentFixture<ProfileDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDetailsModalComponent]
    });
    fixture = TestBed.createComponent(ProfileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
