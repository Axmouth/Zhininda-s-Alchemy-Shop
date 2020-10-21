import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/auth';
import { AuthResult } from 'src/auth/internal/auth-result';
import { CustomValidators, MismatchValidator } from 'src/app/components/register-page/register-page.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'zas-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.scss'],
})
export class PasswordResetPageComponent implements OnInit, OnDestroy {
  successMessages: string[];
  errors: string[] = [];
  result: AuthResult;
  loading = false;
  success: boolean;
  ngUnsubscribe = new Subject<void>();
  passwordResetForm = new FormGroup({
    newPassword: new FormControl(''),
    newPassword2: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Password Reset | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    this.setValidators();
  }

  onPasswordResetSubmit(): void {
    this.loading = true;
    this.authService
      .passwordReset({
        newPassword: this.passwordResetForm.get('newPassword').value,
        newPassword2: this.passwordResetForm.get('newPassword2').value,
      })
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

  private setValidators(): void {
    const formValidators = {
      password: Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(35),
        // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, { hasUpperCase: true }),
        // check whether the entered password has a lower-case letter
        CustomValidators.patternValidator(/[a-z]/, { hasLowerCase: true }),
        // check whether the entered password has a special character
        CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
      ]),
      password2: Validators.compose([
        Validators.required,
        MismatchValidator.mismatch(this.passwordResetForm.get('newPassword')),
      ]),
    };

    this.passwordResetForm.get('newPassword').setValidators(formValidators.password);
    this.passwordResetForm.get('newPassword2').setValidators(formValidators.password2);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
