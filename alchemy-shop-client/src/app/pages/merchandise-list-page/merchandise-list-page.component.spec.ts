import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseListPageComponent } from './merchandise-list-page.component';

describe('MerchandiseListPageComponent', () => {
  let component: MerchandiseListPageComponent;
  let fixture: ComponentFixture<MerchandiseListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
