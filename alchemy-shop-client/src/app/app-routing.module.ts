import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';
import { MyOrdersPageComponent } from './components/my-orders-page/my-orders-page.component';
import { AccountSettingsPageComponent } from './components/account-settings-page/account-settings-page.component';
import { ShoppingCartPageComponent } from './components/shopping-cart-page/shopping-cart-page.component';
import { MerchandiseListPageComponent } from './components/merchandise-list-page/merchandise-list-page.component';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';
import { CheckoutCompletePageComponent } from './components/checkout-complete-page/checkout-complete-page.component';
import { MerchandiseDetailsPageComponent } from './components/merchandise-details-page/merchandise-details-page.component';
import { GuestGuard } from 'src/auth/guards/guest.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { MyOrderDetailsPageComponent } from './components/my-order-details-page/my-order-details-page.component';
import { RequestPasswordResetPageComponent } from './components/request-password-reset-page/request-password-reset-page.component';
import { VerifyEmailPageComponent } from './components/verify-email-page/verify-email-page.component';
import { PasswordResetPageComponent } from './components/password-reset-page/password-reset-page.component';
import { EffectsListPageComponent } from './components/effects-list-page/effects-list-page.component';

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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
