import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseDetailsPageComponent } from './merchandise-details-page.component';

describe('MerchandiseDetailsPageComponent', () => {
  let component: MerchandiseDetailsPageComponent;
  let fixture: ComponentFixture<MerchandiseDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
