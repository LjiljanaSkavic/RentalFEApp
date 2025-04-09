import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalfunctionComponent } from './malfunction.component';

describe('MalfunctionComponent', () => {
  let component: MalfunctionComponent;
  let fixture: ComponentFixture<MalfunctionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MalfunctionComponent]
    });
    fixture = TestBed.createComponent(MalfunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
