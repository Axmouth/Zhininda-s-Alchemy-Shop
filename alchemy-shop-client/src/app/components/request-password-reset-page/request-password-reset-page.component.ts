import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import { AuthResult } from 'src/auth/internal/auth-result';
import { AuthService } from 'src/auth/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'zas-request-password-reset-page',
  templateUrl: './request-password-reset-page.component.html',
  styleUrls: ['./request-password-reset-page.component.scss'],
})
export class RequestPasswordResetPageComponent implements OnInit, OnDestroy {
  successMessages: string[];
  errors: string[] = [];
  result: AuthResult;
  loading = false;
  success: boolean;
  ngUnsubscribe = new Subject<void>();
  requestPasswordResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Request Password Reset | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
  }

  onRequestPasswordResetSubmit(): void {
    this.authService
      .requestPasswordReset({ email: this.requestPasswordResetForm.get('email').value })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.result = result;
          if (result.isSuccess()) {
            this.success = true;
            this.errors = [];
            this.successMessages = result.getMessages();
            this.alertService.clearErrorList();
          } else {
            this.success = false;
            console.log(result.getResponse());
            console.log(result.getErrors());
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
