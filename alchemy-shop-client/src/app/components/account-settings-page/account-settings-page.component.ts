import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AccountSettings } from 'src/app/models/api/account-settings';
import { FormGroup, FormControl } from '@angular/forms';
import { ErrorsService } from 'src/app/services/errors.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-account-settings-page',
  templateUrl: './account-settings-page.component.html',
  styleUrls: ['./account-settings-page.component.scss'],
})
export class AccountSettingsPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  accountSettingsForm = new FormGroup({
    username: new FormControl(''),
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

  constructor(
    private accountService: AccountService,
    private errorsService: ErrorsService,
    private messagesService: MessagesService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Account Settings - Zhininda's Alchemy Shop`);
    this.initialise();
  }

  initialise(): void {
    this.accountService
      .getAccountSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.mySettings = result.data;
          this.accountSettingsForm.setValue(result.data);
        },
        (err) => {
          console.log(err);
          this.errorsService.setErrorList(err?.errors);
        },
      );
  }

  onUpdateAccountSettingsSubmit(): void {
    this.mySettings = this.accountSettingsForm.getRawValue();
    this.messagesService.setMessageList([]);
    this.accountService
      .updateAccountSettings(this.mySettings)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.mySettings = result.data;
          this.accountSettingsForm.setValue(result.data);
          this.messagesService.setMessageList(['Your settings have been updated.']);
        },
        (err) => {
          console.log(err);
          this.errorsService.setErrorList(err?.errors);
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
