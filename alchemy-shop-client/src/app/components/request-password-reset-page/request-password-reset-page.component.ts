import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map, takeWhile, takeUntil } from 'rxjs/operators';
import { AuthResult } from 'src/auth/internal/auth-result';
import { AuthService } from 'src/auth/services/auth.service';
import { ErrorsService } from '../../services/errors.service';

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
    private errorsService: ErrorsService,
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
            this.errorsService.setErrorList([]);
          } else {
            this.success = false;
            console.log(result.getResponse());
            console.log(result.getErrors());
            this.errors = result.getResponse().error.errors;
            this.errorsService.setErrorList(this.errors);
          }
          this.loading = false;
        },
        (err) => {
          console.log(err);
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
