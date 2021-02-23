import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPartialComponent } from './components/login-partial/login-partial.component';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { ShoppingCartSummaryComponent } from './components/shopping-cart-summary/shopping-cart-summary.component';
import { AboutPageComponent } from 'src/app/pages/about-page/about-page.component';
import { ContactPageComponent } from 'src/app/pages/contact-page/contact-page.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { NotFoundPageComponent } from 'src/app/pages/not-found-page/not-found-page.component';
import { RegisterPageComponent } from 'src/app/pages/register-page/register-page.component';
import { LoginPageComponent } from 'src/app/pages/about-page/login-page/login-page.component';
import { MyOrdersPageComponent } from 'src/app/pages/my-orders-page/my-orders-page.component';
import { MyProfilePageComponent } from 'src/app/pages/my-profile-page/my-profile-page.component';
import { AccountSettingsPageComponent } from 'src/app/pages/account-settings-page/account-settings-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MerchandiseSummaryComponent } from './components/merchandise-summary/merchandise-summary.component';
import { PreferredMerchandiseSummaryComponent } from './components/preferred-merchandise-summary/preferred-merchandise-summary.component';
import { CheckoutPageComponent } from 'src/app/pages/checkout-page/checkout-page.component';
import { CheckoutCompletePageComponent } from 'src/app/pages/checkout-complete-page/checkout-complete-page.component';
import { MerchandiseListPageComponent } from 'src/app/pages/merchandise-list-page/merchandise-list-page.component';
import { MerchandiseDetailsPageComponent } from 'src/app/pages/merchandise-details-page/merchandise-details-page.component';
import { ShoppingCartPageComponent } from 'src/app/pages/shopping-cart-page/shopping-cart-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from 'src/auth/auth.module';
import { apiRoot, jwtWhitelist } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyOrderDetailsPageComponent } from 'src/app/pages/my-order-details-page/my-order-details-page.component';
import { PasswordResetPageComponent } from 'src/app/pages/password-reset-page/password-reset-page.component';
import { RequestPasswordResetPageComponent } from 'src/app/pages/request-password-reset-page/request-password-reset-page.component';
import { VerifyEmailPageComponent } from 'src/app/pages/verify-email-page/verify-email-page.component';
import { EffectsListPageComponent } from 'src/app/pages/effects-list-page/effects-list-page.component';
import { FooterComponent } from './components/footer/footer.component';

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
    FooterComponent,
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
