import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Title } from '@angular/platform-browser';
import { AccountService } from 'src/app/services/account.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CheckoutRequest } from '../../models/api/checkout-request';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'zas-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  checkoutForm = new FormGroup({
    addressLine: new FormControl(''),
    zipcode: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  constructor(
    private router: Router,
    private orderService: OrderService,
    private shoppingCartService: ShoppingCartService,
    private accountService: AccountService,
    private errorsService: ErrorsService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Checkout - Zhininda's Alchemy Shop`);
    this.accountService
      .getAccountSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        const { username, publicInfo, newPassword, confirmNewPassword, currentPassword, ...checkoutData } = {
          ...result.data,
        };

        this.checkoutForm.setValue(checkoutData);
      });
  }

  onCheckoutSubmit(): void {
    const checkoutRequest: CheckoutRequest = this.checkoutForm.getRawValue();
    this.orderService
      .checkout(checkoutRequest)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.errorsService.setErrorList([]);
          this.shoppingCartService.reload();
          this.router.navigateByUrl('/shopping-cart/checkout-complete');
        },
        (err) => {
          console.log(err);
          this.errorsService.setErrorList(err?.error?.errors);
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
