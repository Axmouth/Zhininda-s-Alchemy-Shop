import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

export class MismatchValidator {
  static mismatch(otherInputControl: AbstractControl): ValidatorFn {
    return (inputControl: AbstractControl): { [key: string]: boolean } | null => {
      if (
        inputControl.value !== undefined &&
        inputControl.value.trim() !== '' &&
        inputControl.value !== otherInputControl.value
      ) {
        return { mismatch: true };
      }

      return null;
    };
  }
}

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
}

@Component({
  selector: 'zas-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
      // check whether the entered name has no special character
      CustomValidators.patternValidator(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/, {
        hasNoSpecialCharacters: true,
      }),
      // check whether the entered name starts or ends with a space
      CustomValidators.patternValidator(/^[^ ]+.*[^ ]+$/, {
        hasSpacePrefixOrSuffix: true,
      }),
    ]),
    password: new FormControl(''),
    password2: new FormControl(''),
  });
  errors = [];

  registerInProgress = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Create A New Account | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    this.setValidators();
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
        MismatchValidator.mismatch(this.registerForm.get('password')),
      ]),
    };

    this.registerForm.get('password').setValidators(formValidators.password);
    this.registerForm.get('password2').setValidators(formValidators.password2);
  }

  onRegisterSubmit(): void {
    this.registerInProgress = true;
    this.accountService
      .register({
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        confirmPassword: this.registerForm.get('password2').value,
        userName: this.registerForm.get('username').value,
      })
      .subscribe(
        async (result) => {
          if (result.isSuccess()) {
            // await this.router.navigateByUrl(this.routeStateService.getPreviousUrl());
            await this.router.navigateByUrl('/');
          } else {
            this.errors = result.getResponse().error.errors;
          }
          this.registerInProgress = false;
        },
        (err) => {
          this.registerInProgress = false;
          console.log(err);
        },
      );
  }
}
