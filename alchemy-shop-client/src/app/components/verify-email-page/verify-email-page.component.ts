import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/auth';
import { AuthResult } from 'src/auth/internal/auth-result';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'zas-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss'],
})
export class VerifyEmailPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  result: AuthResult;
  errors: string[] = [];
  loading = true;
  success: boolean;
  successMessages: string[];

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Verify Email | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    this.authService.verifyEmail().subscribe(
      (result) => {
        this.result = result;
        if (result.isSuccess()) {
          this.success = true;
          this.errors = [];
          this.successMessages = result.getMessages();
          this.alertService.clearErrorList();
        } else {
          this.success = false;
          this.errors = result.getResponse().error.errors;
          this.alertService.setErrorList(this.errors);
          this.alertService.clearSucessMessageList();
        }
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      },
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
