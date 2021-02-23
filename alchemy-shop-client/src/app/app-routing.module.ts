import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from 'src/app/pages/not-found-page/not-found-page.component';
import { AboutPageComponent } from 'src/app/pages/about-page/about-page.component';
import { ContactPageComponent } from 'src/app/pages/contact-page/contact-page.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { RegisterPageComponent } from 'src/app/pages/register-page/register-page.component';
import { LoginPageComponent } from 'src/app/pages/about-page/login-page/login-page.component';
import { MyProfilePageComponent } from 'src/app/pages/my-profile-page/my-profile-page.component';
import { MyOrdersPageComponent } from 'src/app/pages/my-orders-page/my-orders-page.component';
import { AccountSettingsPageComponent } from 'src/app/pages/account-settings-page/account-settings-page.component';
import { ShoppingCartPageComponent } from 'src/app/pages/shopping-cart-page/shopping-cart-page.component';
import { MerchandiseListPageComponent } from 'src/app/pages/merchandise-list-page/merchandise-list-page.component';
import { CheckoutPageComponent } from 'src/app/pages/checkout-page/checkout-page.component';
import { CheckoutCompletePageComponent } from 'src/app/pages/checkout-complete-page/checkout-complete-page.component';
import { MerchandiseDetailsPageComponent } from 'src/app/pages/merchandise-details-page/merchandise-details-page.component';
import { GuestGuard } from 'src/auth/guards/guest.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MyOrderDetailsPageComponent } from 'src/app/pages/my-order-details-page/my-order-details-page.component';
import { RequestPasswordResetPageComponent } from 'src/app/pages/request-password-reset-page/request-password-reset-page.component';
import { VerifyEmailPageComponent } from 'src/app/pages/verify-email-page/verify-email-page.component';
import { PasswordResetPageComponent } from 'src/app/pages/password-reset-page/password-reset-page.component';
import { EffectsListPageComponent } from 'src/app/pages/effects-list-page/effects-list-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'merchandise/list', component: MerchandiseListPageComponent, pathMatch: 'full' },
  { path: 'merchandise/details/:merchandiseId', component: MerchandiseDetailsPageComponent, pathMatch: 'full' },
  { path: 'effects/list', component: EffectsListPageComponent, pathMatch: 'full' },
  { path: 'shopping-cart', component: ShoppingCartPageComponent, pathMatch: 'full' },
  { path: 'shopping-cart/checkout', component: CheckoutPageComponent, pathMatch: 'full' },
  { path: 'shopping-cart/checkout-complete', component: CheckoutCompletePageComponent, pathMatch: 'full' },
  { path: 'account/profile', component: MyProfilePageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'account/orders/list', component: MyOrdersPageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: 'account/orders/details/:orderId',
    component: MyOrderDetailsPageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'account/settings', component: AccountSettingsPageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'account/login', component: LoginPageComponent, pathMatch: 'full', canActivate: [GuestGuard] },
  { path: 'account/register', component: RegisterPageComponent, pathMatch: 'full', canActivate: [GuestGuard] },
  { path: 'about', component: AboutPageComponent, pathMatch: 'full' },
  { path: 'contact', component: ContactPageComponent, pathMatch: 'full' },
  { path: 'request-password-reset', component: RequestPasswordResetPageComponent, pathMatch: 'full' },
  { path: 'password-reset', component: PasswordResetPageComponent, pathMatch: 'full' },
  { path: 'verify-email', component: VerifyEmailPageComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
