import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ErrorsService } from '../../services/errors.service';
import { AccountSettings } from '../../models/api/account-settings';
import { AccountService } from 'src/app/services/account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'zas-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });
  errors = [];

  loginInProgress = false;

  constructor(
    private accountService: AccountService,
    private errorsService: ErrorsService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Login | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
  }

  onLoginSubmit(): void {
    this.loginInProgress = true;
    this.accountService
      .authenticate({
        userName: this.loginForm.get('username').value,
        password: this.loginForm.get('password').value,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        async (result) => {
          if (result.isSuccess()) {
            // await this.router.navigateByUrl(this.routeStateService.getPreviousUrl());
            await this.router.navigateByUrl('/');
          } else {
            this.errors = result.getResponse().error.errors;
            this.errorsService.setErrorList(result.getResponse().error.errors);
          }
          this.loginInProgress = false;
        },
        (err) => {
          this.loginInProgress = false;
          console.log(err);
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
