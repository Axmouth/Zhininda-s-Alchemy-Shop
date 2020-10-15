export interface AuthModuleOptionsConfig {
  authEndpointPrefix: string;
  headerName?: string;
  authScheme?: string;
  whitelistedDomains?: Array<string | RegExp>;
  blacklistedRoutes?: Array<string | RegExp>;
  throwNoTokenError?: boolean;
  jwtTokenKey?: string;
  skipWhenExpired?: boolean;
  loginEndpoint?: string;
  loginMethod?: HttpMethod;
  logoutEndpoint?: string;
  logoutMethod?: HttpMethod;
  refreshEndpoint?: string;
  refreshMethod?: HttpMethod;
  registerEndpoint?: string;
  registerMethod?: HttpMethod;
  profileEndpoint?: string;
  profileMethod?: HttpMethod;
  requestPasswordResetEndpoint?: string;
  requestPasswordResetMethod?: HttpMethod;
  passwordResetEndpoint?: string;
  passwordResetMethod?: HttpMethod;
  verifyEmailEndpoint?: string;
  verifyEmailMethod?: HttpMethod;
  sendEmailVerificationEmailEndpoint?: string;
  sendEmailVerificationEmailMethod?: HttpMethod;
  requestVerificationEmailEndpoint?: string;
  requestVerificationEmailMethod?: HttpMethod;
  passwordResetConfig?: PasswordResetConfig;
  verifyEmailConfig?: VerifyEmailConfig;
}

export interface PasswordResetConfig {
  tokenQueryKey: string;
  userNameQueryKey: string;
  emailQueryKey: string;
  tokenKey: string;
  userNameKey: string;
  emailKey: string;
}

export interface VerifyEmailConfig {
  tokenQueryKey: string;
  userNameQueryKey: string;
  emailQueryKey: string;
  tokenKey: string;
  userNameKey: string;
  emailKey: string;
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
