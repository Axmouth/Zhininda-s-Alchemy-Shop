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

  getUsername(): Observable<string> {
    return this.authService.getUsername();
  }

  getProfile(): Observable<BaseResponse<ProfileResponse>> {
    return this.apiService.getAll<BaseResponse<ProfileResponse>>(this.accountProfileUrl, {});
  }

  getAccountSettings(): Observable<BaseResponse<AccountSettings>> {
    return this.apiService.getAll<BaseResponse<AccountSettings>>(this.accountSettingsUrl, {});
  }

  updateAccountSettings(updatedSettings: AccountSettings): Observable<BaseResponse<AccountSettings>> {
    return this.apiService.update<BaseResponse<AccountSettings>>(this.accountSettingsUrl, '', updatedSettings, {});
  }

  authenticate(data: any): Observable<AuthResult> {
    return this.authService.authenticate(data);
  }

  isAuthenticatedOrRefresh(): Observable<boolean> {
    return this.authService.isAuthenticatedOrRefresh();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }

  onAuthenticationChange(): Observable<boolean> {
    return this.authService.onAuthenticationChange();
  }

  register(data: any): Observable<AuthResult> {
    return this.authService.register(data);
  }

  logout(): Observable<AuthResult> {
    return this.authService.logout();
  }
}
