import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/auth';
import { ProfileResponse } from 'src/app/models/api/profile-response';
import { AuthResult } from 'src/auth/internal/auth-result';
import { RestApiService } from 'src/app/services/rest-api.service';
import { apiRoot } from 'src/environments/environment';
import { BaseResponse } from '../models/api/base-response';
import { AccountSettings } from '../models/api/account-settings';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  accountUrl = `${apiRoot}account`;
  accountSettingsUrl = `${apiRoot}account/settings`;
  accountProfileUrl = `${apiRoot}account/profile`;

  constructor(private authService: AuthService, private apiService: RestApiService) {}

  /**
   * Retrieves the logged in user's username
   * It is assumed it stored under sub inside the token
   *
   */
  getUsername(): Observable<string> {
    return this.authService.getUsername();
  }

  /**
   * Retrieves the logged in user's email
   * It is assumed it stored under email inside the token
   *
   */
  getEmail(): Observable<string> {
    return this.authService.getEmail();
  }

  /**
   * Retrieves the logged in user's email
   * It is assumed it stored under email inside the token
   *
   */
  getProfile(): Observable<BaseResponse<ProfileResponse>> {
    return this.apiService.getAll<BaseResponse<ProfileResponse>>(this.accountProfileUrl, {});
  }

  /**
   * Retrieves the logged in user's account settings
   *
   */
  getAccountSettings(): Observable<BaseResponse<AccountSettings>> {
    return this.apiService.getAll<BaseResponse<AccountSettings>>(this.accountSettingsUrl, {});
  }

  /**
   * Updates the logged in user's account settings
   *
   */
  updateAccountSettings(updatedSettings: AccountSettings): Observable<BaseResponse<AccountSettings>> {
    return this.apiService.update<BaseResponse<AccountSettings>>(this.accountSettingsUrl, '', updatedSettings, {});
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
  authenticate(data: any): Observable<AuthResult> {
    return this.authService.authenticate(data);
  }

  /**
   * Returns true if valid auth token is present in the token storage.
   * If not, calls refreshToken, and returns isAuthenticated() if success, false otherwise
   */
  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh();
  }

  /**
   * Returns true if auth token is present in the token storage
   */
  isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }

  /**
   * Returns authentication status stream
   */
  onAuthenticationChange(): Observable<boolean> {
    return this.authService.onAuthenticationChange();
  }

  /**
   * Registers
   * Stores received token in the token storage
   *
   * Example:
   * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
   *
   */
  register(data: any): Observable<AuthResult> {
    return this.authService.register(data);
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
    return this.authService.logout();
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
    return this.authService.requestPasswordReset(data);
  }

  /**
   * Tries to reset password
   *
   * Example:
   * passwordReset({newPassword: 'test'})
   *
   */
  passwordReset(data?: any): Observable<AuthResult> {
    return this.authService.passwordReset(data);
  }

  /**
   * Requests an email for email verification
   *
   * Example:
   * verifyEmail({email: 'user@example.com'})
   *
   */
  requestVerificationEmail(data?: any): Observable<AuthResult> {
    return this.authService.requestVerificationEmail(data);
  }

  /**
   * Uses an email verification token to confirm you own the email address you used
   *
   * Example:
   * verifyEmail()
   *
   */
  verifyEmail(): Observable<AuthResult> {
    return this.authService.verifyEmail();
  }
}
