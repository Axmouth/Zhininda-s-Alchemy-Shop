import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileResponse } from '../../models/api/profile-response';
import { AccountService } from '../../services/account.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.scss'],
})
export class MyProfilePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  myProfile: ProfileResponse;

  constructor(private accountService: AccountService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`My Profile - Zhininda's Alchemy Shop`);
    this.initialise();
  }

  initialise(): void {
    this.accountService
      .getProfile()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.myProfile = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
