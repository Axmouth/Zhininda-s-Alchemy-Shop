import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCompletePageComponent } from './checkout-complete-page.component';

describe('CheckoutCompletePageComponent', () => {
  let component: CheckoutCompletePageComponent;
  let fixture: ComponentFixture<CheckoutCompletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutCompletePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
