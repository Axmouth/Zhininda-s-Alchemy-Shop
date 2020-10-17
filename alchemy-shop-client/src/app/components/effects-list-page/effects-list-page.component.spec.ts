import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectsListPageComponent } from './effects-list-page.component';

describe('EffectsListPageComponent', () => {
  let component: EffectsListPageComponent;
  let fixture: ComponentFixture<EffectsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
