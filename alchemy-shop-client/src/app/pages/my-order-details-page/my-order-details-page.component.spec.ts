import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrderDetailsPageComponent } from './my-order-details-page.component';

describe('MyOrderDetailsPageComponent', () => {
  let component: MyOrderDetailsPageComponent;
  let fixture: ComponentFixture<MyOrderDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOrderDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrderDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
