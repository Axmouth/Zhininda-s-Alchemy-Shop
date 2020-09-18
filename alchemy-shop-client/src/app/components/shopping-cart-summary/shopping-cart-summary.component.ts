import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zas-shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.scss'],
})
export class ShoppingCartSummaryComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  cartItemsCount = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    this.shoppingCartService
      .getCartItemAmount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((amount) => {
        this.cartItemsCount = amount;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
