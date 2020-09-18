import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseSummaryComponent } from './merchandise-summary.component';

describe('MerchandiseSummaryComponent', () => {
  let component: MerchandiseSummaryComponent;
  let fixture: ComponentFixture<MerchandiseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
