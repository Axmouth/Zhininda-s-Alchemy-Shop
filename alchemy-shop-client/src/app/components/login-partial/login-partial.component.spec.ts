import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPartialComponent } from './login-partial.component';

describe('LoginPartialComponent', () => {
  let component: LoginPartialComponent;
  let fixture: ComponentFixture<LoginPartialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPartialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
