import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseDetailsPlaceholderComponent } from './merchandise-details-placeholder.component';

describe('MerchandiseDetailsPlaceholderComponent', () => {
  let component: MerchandiseDetailsPlaceholderComponent;
  let fixture: ComponentFixture<MerchandiseDetailsPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseDetailsPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseDetailsPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
