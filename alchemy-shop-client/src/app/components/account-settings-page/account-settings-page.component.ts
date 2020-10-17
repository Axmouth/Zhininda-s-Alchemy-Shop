import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AccountSettings } from 'src/app/models/api/account-settings';
import { FormGroup, FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { AlertService } from 'src/app/services/alert.service';
import { IsBrowserService } from 'src/auth/helpers/services/is-browser.service';

@Component({
  selector: 'zas-account-settings-page',
  templateUrl: './account-settings-page.component.html',
  styleUrls: ['./account-settings-page.component.scss'],
})
export class AccountSettingsPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  accountSettingsForm = new FormGroup({
    username: new FormControl({ value: '', disabled: true }),
    addressLine: new FormControl(''),
    zipcode: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
    publicInfo: new FormControl(''),
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
  });
  mySettings: AccountSettings;
  sendAccountVerificationEmailClickInProgress = false;
  requestPasswordResetInProgress = false;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private isBrowserService: IsBrowserService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Account Settings | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    if (!this.isBrowserService.isInBrowser()) {
      return;
    }
    this.initialise();
  }

  initialise(): void {
    this.accountService
      .getAccountSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.mySettings = { newPassword: null, confirmNewPassword: null, currentPassword: null, ...result.data };
          this.accountSettingsForm.setValue(this.mySettings);
        },
        (err) => {
          console.log(err);
          this.alertService.setErrorList(err?.errors);
        },
      );
  }

  onUpdateAccountSettingsSubmit(): void {
    this.mySettings = this.accountSettingsForm.getRawValue();
    this.alertService.setMessageList([]);
    this.accountService
      .updateAccountSettings(this.mySettings)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.mySettings = { newPassword: null, confirmNewPassword: null, currentPassword: null, ...result.data };
          this.accountSettingsForm.setValue(this.mySettings);
          this.alertService.setMessageList(['Your settings have been updated.']);
        },
        (err) => {
          console.log(err);
          this.alertService.setErrorList(err?.errors);
        },
      );
  }

  onSendAccountVerificationEmailClick(): void {
    this.sendAccountVerificationEmailClickInProgress = true;
    this.accountService
      .getEmail()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        switchMap((email) => {
          return this.accountService
            .requestVerificationEmail({ email })
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(
              map((t) => {
                this.sendAccountVerificationEmailClickInProgress = false;
                return t;
              }),
            );
        }),
      )
      .subscribe();
  }

  onResetYourPasswordClick(): void {
    this.requestPasswordResetInProgress = true;
    this.accountService
      .getEmail()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(
        switchMap((email) => {
          return this.accountService
            .requestPasswordReset({ email })
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(
              map((t) => {
                this.requestPasswordResetInProgress = false;
                return t;
              }),
            );
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
