import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredMerchandiseSummaryComponent } from './preferred-merchandise-summary.component';

describe('PreferredMerchandiseSummaryComponent', () => {
  let component: PreferredMerchandiseSummaryComponent;
  let fixture: ComponentFixture<PreferredMerchandiseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferredMerchandiseSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredMerchandiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
