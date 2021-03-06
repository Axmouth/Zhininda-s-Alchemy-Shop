import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'zas-login-partial',
  templateUrl: './login-partial.component.html',
  styleUrls: ['./login-partial.component.scss'],
})
export class LoginPartialComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  loggedIn = false;
  username = '';

  constructor(private router: Router, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .isAuthenticatedOrRefresh()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isAuth) => {
        this.loggedIn = isAuth;
      });
    this.accountService
      .onAuthenticationChange()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.loggedIn = result;
        if (this.loggedIn) {
          this.accountService
            .getUsername()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((username) => {
              this.username = username;
            });
        }
      });
  }

  onLogoutClick(): void {
    this.accountService
      .logout()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.router.navigateByUrl('/');
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
