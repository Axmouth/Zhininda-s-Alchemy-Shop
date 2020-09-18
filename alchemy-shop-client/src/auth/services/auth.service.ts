import { Injectable, Inject, OnDestroy } from '@angular/core';
import { TokenService } from './token.service';
import { map, switchMap, catchError, retry, take, takeUntil } from 'rxjs/operators';
import { Observable, of, observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthSuccess } from 'src/app/models/api/auth-success-response';
import { AuthResult } from '../internal/auth-result';
import { AuthToken } from '../internal/auth-token';
import { AuthJWTToken, AuthCreateJWTToken } from '../internal/auth-jwt-token';
import { AuthIllegalTokenError } from '../internal/auth-illegal-token-error';
import { isPlatformBrowser } from '@angular/common';
import { AX_AUTH_OPTIONS } from '../auth-injection-token';
import { AuthModuleOptionsConfig } from '../auth-module-options-config';
import { User } from 'src/app/models/api/user';
import { IsBrowserService } from 'src/auth/helpers/services/is-browser.service';
import { BaseResponse } from 'src/app/models/api/base-response';
import { ProfileResponse } from '../../app/models/api/profile-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  authenticating = false;
  authenticatingNotifier = new Subject<AuthResult>();

  authEndpointPrefix: string;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private isBrowserService: IsBrowserService,
    @Inject(AX_AUTH_OPTIONS) config: AuthModuleOptionsConfig,
  ) {
    this.authEndpointPrefix = config.authEndpointPrefix;
  }

  /**
   * Retrieves the logged in user's username
   * It is assumed it stored under sub inside the token
   *
   */
  getUsername(): Observable<string> {
    return this.tokenService
      .get()
      .pipe(
        map((token) => {
          if (!this.isBrowserService.isInBrowser()) {
            return null;
          }
          const payload = token.getPayload();
          if (payload) {
            return payload.display_name;
          }
          return null;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Retrieves the logged in user's email
   * It is assumed it stored under email inside the token
   *
   */
  getEmail(): Observable<string> {
    return this.tokenService
      .get()
      .pipe(
        map((token) => {
          if (!this.isBrowserService.isInBrowser()) {
            return null;
          }
          const payload = token.getPayload();
          if (payload) {
            return payload.email;
          }
          return null;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Retrieves the logged in user's email
   * It is assumed it stored under email inside the token
   *
   */
  getProfile(): Observable<BaseResponse<ProfileResponse>> {
    const url = `${this.authEndpointPrefix}profile`;
    const result = baseApiRequest<BaseResponse<ProfileResponse>>(this.http, url, {}, 'get', undefined)
      .pipe(
        map((res) => {
          return res;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
    return result;
  }

  /**
   * Authenticates
   * Stores received token in the token storage
   *
   * Example:
   * authenticate('{email: 'email@example.com', password: 'test'})
   * authenticate( {userName: 'email@example.com', password: 'test'})
   * authenticate( {userName: 'username', password: 'test'})
   *
   */
  authenticate(data?: any): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}login`;

    const result = baseApiRequest<BaseResponse<AuthSuccess>>(this.http, url, {}, 'post', data).pipe(
      map((res) => {
        return new AuthResult(
          true,
          res,
          true,
          [], // ['Login/Email combination is not correct, please try again.'],
          ['You have been successfully logged in.'],
          this.createToken(res.data?.token, true),
        );
      }),
      catchError((res) => {
        return this.handleResponseError(res);
      }),
    );
    return result
      .pipe(
        switchMap((authResult: AuthResult) => {
          return this.processResultToken(authResult);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Sign outs
   * Removes token from the token storage
   *
   * Example:
   * logout('email')
   *
   */
  logout(): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}logout`;
    const result = of({}).pipe(
      switchMap((res: any) => {
        if (!url) {
          return of(res);
        }
        return baseApiRequest<BaseResponse<null>>(this.http, url, {}, 'delete', undefined);
      }),
      map((res) => {
        return new AuthResult(
          true,
          res,
          true,
          [], // ['Something went wrong, please try again.'],
          ['You have been successfully logged out.'],
        );
      }),
      catchError((res) => {
        return this.handleResponseError(res);
      }),
    );
    return result
      .pipe(
        switchMap((authResult: AuthResult) => {
          if (authResult?.isSuccess()) {
          }
          if (authResult?.getResponse()?.status === 404 || authResult?.getResponse()?.status === '404') {
            return of(authResult);
          }
          return this.tokenService.clear().pipe(map(() => authResult));
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Registers
   * Stores received token in the token storage
   *
   * Example:
   * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
   *
   */
  register(data?: any): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}register`;
    const result = baseApiRequest<BaseResponse<AuthSuccess>>(this.http, url, {}, 'post', data).pipe(
      map((res) => {
        return new AuthResult(
          true,
          res,
          true,
          [], // ['Something went wrong, please try again.'],
          ['You have been successfully registered.'],
          this.createToken(res.data?.token, true),
        );
      }),
      catchError((res) => {
        return this.handleResponseError(res).pipe(takeUntil(this.ngUnsubscribe));
      }),
    );
    return result
      .pipe(
        switchMap((authResult: AuthResult) => {
          return this.processResultToken(authResult).pipe(takeUntil(this.ngUnsubscribe));
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Returns true if auth token is present in the token storage
   */
  isAuthenticated(): Observable<boolean> {
    if (!this.isBrowserService.isInBrowser()) {
      return of(false);
    }
    return this.getToken()
      .pipe(map((token: AuthToken) => token.isValid()))
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Returns true if valid auth token is present in the token storage.
   * If not, calls refreshToken, and returns isAuthenticated() if success, false otherwise
   */
  isAuthenticatedOrRefresh(callback$?: Observable<any>): Observable<boolean> {
    if (!this.isBrowserService.isInBrowser()) {
      return of(false);
    }
    if (this.authenticating) {
      // check if auth request is in progress and do nothing then
      return this.authenticatingNotifier
        .pipe(take(1))
        .pipe(map((authResult) => authResult.isSuccess()))
        .pipe(takeUntil(this.ngUnsubscribe));
    }
    return this.getToken().pipe(
      switchMap((token) => {
        if (token.getValue() && !token.isValid()) {
          return this.refreshToken(token, callback$).pipe(
            switchMap((res) => {
              if (res === null) {
                // For the case where there is an auth request in progress. Keep the status quo
                return of(true);
              }
              if (res.isSuccess()) {
                return this.isAuthenticated().pipe(takeUntil(this.ngUnsubscribe));
              } else {
                console.log(res.getResponse());
                if (res.getResponse().status !== 400 && res.getResponse().status !== '400') {
                  return this.isAuthenticated().pipe(takeUntil(this.ngUnsubscribe));
                }
                /*
                return this.logout().pipe(
                  map((result) => {
                    return !result.isSuccess();
                  }),
                );*/
                return of(false).pipe(takeUntil(this.ngUnsubscribe));
              }
            }),
          );
        } else {
          return of(token.isValid()).pipe(takeUntil(this.ngUnsubscribe));
        }
      }),
    );
  }

  /**
   * Returns authentication status stream
   */
  onAuthenticationChange(): Observable<boolean> {
    if (!this.isBrowserService.isInBrowser()) {
      return of(false).pipe(takeUntil(this.ngUnsubscribe));
    }
    return this.onTokenChange()
      .pipe(map((token: AuthToken) => token.isValid()))
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Sends a refresh token request
   * Stores received token in the token storage
   *
   * Example:
   * refreshToken({token: token})
   *
   */
  refreshToken(data?: any, callback$?: Observable<any>): Observable<AuthResult> {
    if (this.authenticating) {
      // check if auth request is in progress and do nothing then
      return this.authenticatingNotifier
        .pipe(take(1))
        .pipe(
          switchMap((value, index) => {
            return this.refreshToken(data, callback$);
          }),
        )
        .pipe(takeUntil(this.ngUnsubscribe));
    }
    // set the flag that there is an auth request in progress
    this.authenticating = true;

    const url = `${this.authEndpointPrefix}refresh`;
    const refresh$ = baseApiRequest<BaseResponse<AuthSuccess>>(this.http, url, {}, 'post', data)
      .pipe(
        map((res) => {
          const token = AuthCreateJWTToken(res.data?.token, 'refreshToken');
          this.authenticating = false;
          const authResult = new AuthResult(
            true,
            res,
            true,
            [], // ['Something went wrong re-Authenticating'],
            ['Your token has been successfully refreshed.'],
            token,
          );
          this.authenticatingNotifier.next(authResult);
          return authResult;
        }),
        catchError((res) => {
          this.authenticating = false;
          this.handleResponseError(res)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((authResult) => {
              this.authenticatingNotifier.next(authResult);
            });
          return this.handleResponseError(res);
        }),
      )
      .pipe(
        switchMap((result: AuthResult) => {
          this.authenticating = false;
          this.authenticatingNotifier.next(result);
          return this.processResultToken(result);
        }),
      );
    if (callback$ === undefined) {
      console.log('refreshToken$ - null');
      callback$ = of(null);
    }
    return callback$
      .pipe(
        switchMap((obj) => {
          return refresh$;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  protected handleResponseError(res: any): Observable<AuthResult> {
    return of(new AuthResult(false, res, false, ''));
  }

  /**
   * Retrieves current authenticated token stored
   */
  getToken(): Observable<any> {
    return this.tokenService.get().pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Returns tokens stream
   */
  onTokenChange(): Observable<AuthToken> {
    return this.tokenService.tokenChange().pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Sends forgot password request
   *
   * Example:
   * requestPasswordReset({email: 'email@example.com'})
   * requestPasswordReset({userName: 'username'})
   *
   */
  requestPasswordReset(data?: any): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}password-reset-email`;
    return baseApiRequest(this.http, url, {}, 'post', data)
      .pipe(
        map((res) => {
          return new AuthResult(
            true,
            res,
            true,
            [], // ['Something went wrong, please try again.'],
            ['Reset password instructions have been sent to your email!'],
          );
        }),
        catchError((res) => {
          return this.handleResponseError(res);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Tries to reset password
   *
   * Example:
   * passwordReset({newPassword: 'test'})
   *
   */
  passwordReset(data?: any): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}password-reset`;
    const tokenQueryKey = 'reset_password_token';
    const userNameQueryKey = 'user_name';
    const emailQueryKey = 'email';
    const tokenKey = 'token';
    const userNameKey = 'userName';
    const emailKey = 'email';
    data[tokenKey] = this.route.snapshot.queryParams[tokenQueryKey];
    if (this.route.snapshot.queryParams[userNameQueryKey]) {
      data[userNameKey] = this.route.snapshot.queryParams[userNameQueryKey];
    }
    if (this.route.snapshot.queryParams[emailQueryKey]) {
      data[emailKey] = this.route.snapshot.queryParams[emailQueryKey];
    }
    return baseApiRequest(this.http, url, {}, 'post', data)
      .pipe(
        map((res) => {
          return new AuthResult(
            true,
            res,
            true,
            [], // ['Something went wrong, please try again.'],
            ['Your password has been successfully changed!'],
          );
        }),
        catchError((res) => {
          return this.handleResponseError(res);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Uses an email verification token to confirm you own the email address you used
   *
   * Example:
   * verifyEmail()
   *
   */
  verifyEmail(): Observable<AuthResult> {
    const data = {};
    const url = `${this.authEndpointPrefix}email-confirm`;
    const tokenQueryKey = 'email_confirm_token';
    const userNameQueryKey = 'user_name';
    const emailQueryKey = 'email';
    const tokenKey = 'token';
    const userNameKey = 'userName';
    const emailKey = 'email';
    data[tokenKey] = this.route.snapshot.queryParams[tokenQueryKey];
    if (this.route.snapshot.queryParams[userNameQueryKey]) {
      data[userNameKey] = this.route.snapshot.queryParams[userNameQueryKey];
    }
    if (this.route.snapshot.queryParams[emailQueryKey]) {
      data[emailKey] = this.route.snapshot.queryParams[emailQueryKey];
    }
    return baseApiRequest(this.http, url, {}, 'post', data)
      .pipe(
        map((res) => {
          return new AuthResult(
            true,
            res,
            true,
            [], // ['Something went wrong, please try again.'],
            ['Your Email has been successfully verified!'],
          );
        }),
        catchError((res) => {
          return this.handleResponseError(res);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  /**
   * Requests an email for email verification
   *
   * Example:
   * verifyEmail({email: 'user@example.com'})
   *
   */
  requestVerificationEmail(data?: any): Observable<AuthResult> {
    const url = `${this.authEndpointPrefix}email-confirm-email`;
    return baseApiRequest(this.http, url, {}, 'post', data)
      .pipe(
        map((res) => {
          return new AuthResult(
            true,
            res,
            true,
            [], // ['Something went wrong, please try again.'],
            ['Your verification Email has been successfully sent!'],
          );
        }),
        catchError((res) => {
          return this.handleResponseError(res);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  private processResultToken(result: AuthResult): Observable<AuthResult> {
    if (result.isSuccess() && result.getToken()) {
      return this.tokenService
        .set(result.getToken())
        .pipe(
          map((token: AuthToken) => {
            return result;
          }),
        )
        .pipe(takeUntil(this.ngUnsubscribe));
    }

    return of(result).pipe(takeUntil(this.ngUnsubscribe));
  }

  createToken(value: any, failWhenInvalidToken?: boolean): AuthJWTToken {
    const token = AuthCreateJWTToken(value, 'refreshToken');
    // At this point, AuthCreateToken failed with AuthIllegalTokenError which MUST be intercepted
    // Or token is created. It MAY be created even if backend did not return any token, in this case it is !Valid
    if (failWhenInvalidToken && !token.isValid()) {
      // If we require a valid token (i.e. isValid), then we MUST throw AuthIllegalTokenError so that the we
      // intercept it
      throw new AuthIllegalTokenError('Token is empty or invalid.');
    }
    return token;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

function paramsToQuery(params: any): string {
  return Object.keys(params)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key]
          .map((value: string | number | boolean) => {
            if (value === undefined || value === null) {
              return '';
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          })
          .join('&');
      }
      if (params[key] === undefined || params[key] === null) {
        return '';
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .filter((s) => s !== '')
    .join('&');
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

function baseApiRequest<T>(
  http: HttpClient,
  url: string,
  queryParams: any,
  method: HttpMethod,
  body: any,
): Observable<T> {
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  const queryString = paramsToQuery(queryParams);
  let newUrl = url;
  if (queryString && queryString.length > 0) {
    newUrl = `${newUrl}?${queryString}`;
  }
  return http
    .request<T>(method, newUrl, { body, headers, withCredentials: true, observe: 'response' })
    .pipe(retry(2))
    .pipe(map((result) => result.body));
}