import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseSummaryPlaceholderComponent } from './merchandise-summary-placeholder.component';

describe('MerchandiseSummaryPlaceholderComponent', () => {
  let component: MerchandiseSummaryPlaceholderComponent;
  let fixture: ComponentFixture<MerchandiseSummaryPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseSummaryPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseSummaryPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
