import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPartialComponent } from './components/login-partial/login-partial.component';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { ShoppingCartSummaryComponent } from './components/shopping-cart-summary/shopping-cart-summary.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MyOrdersPageComponent } from './components/my-orders-page/my-orders-page.component';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';
import { AccountSettingsPageComponent } from './components/account-settings-page/account-settings-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MerchandiseSummaryComponent } from './components/merchandise-summary/merchandise-summary.component';
import { PreferredMerchandiseSummaryComponent } from './components/preferred-merchandise-summary/preferred-merchandise-summary.component';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { CheckoutCompletePageComponent } from './components/checkout-complete-page/checkout-complete-page.component';
import { MerchandiseListPageComponent } from './components/merchandise-list-page/merchandise-list-page.component';
import { MerchandiseDetailsPageComponent } from './components/merchandise-details-page/merchandise-details-page.component';
import { ShoppingCartPageComponent } from './components/shopping-cart-page/shopping-cart-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from 'src/auth/auth.module';
import { apiRoot, jwtWhitelist } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyOrderDetailsPageComponent } from './components/my-order-details-page/my-order-details-page.component';
import { PasswordResetPageComponent } from './components/password-reset-page/password-reset-page.component';
import { RequestPasswordResetPageComponent } from './components/request-password-reset-page/request-password-reset-page.component';
import { VerifyEmailPageComponent } from './components/verify-email-page/verify-email-page.component';
import { EffectsListPageComponent } from './components/effects-list-page/effects-list-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPartialComponent,
    CategoryMenuComponent,
    ShoppingCartSummaryComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    NotFoundPageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    MyOrdersPageComponent,
    MyProfilePageComponent,
    AccountSettingsPageComponent,
    CarouselComponent,
    MerchandiseSummaryComponent,
    PreferredMerchandiseSummaryComponent,
    CheckoutPageComponent,
    CheckoutCompletePageComponent,
    MerchandiseListPageComponent,
    MerchandiseDetailsPageComponent,
    ShoppingCartPageComponent,
    MyOrderDetailsPageComponent,
    PasswordResetPageComponent,
    RequestPasswordResetPageComponent,
    VerifyEmailPageComponent,
    EffectsListPageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      config: {
        authEndpointPrefix: `${apiRoot}account/`,
        whitelistedDomains: jwtWhitelist,
        blacklistedRoutes: [],
        skipWhenExpired: false,
        loginTokengetter: (authRes: any) => {
          return authRes.data?.token;
        },
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
