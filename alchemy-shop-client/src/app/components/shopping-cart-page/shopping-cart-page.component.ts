import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShoppingCart } from 'src/app/models/api/shopping-cart';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { MerchandiseService } from '../../services/merchandise.service';
import { Category } from '../../models/api/category';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.scss'],
})
export class ShoppingCartPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  shoppingCartModel: ShoppingCart;
  categories: Category[];
  changeInProgress = false;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private merchandiseService: MerchandiseService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Shopping Cart - Zhininda's Alchemy Shop`);
    this.initialise();
  }

  initialise(): void {
    this.changeInProgress = true;
    this.shoppingCartService
      .getCartItems()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.shoppingCartModel = result.data;
        this.changeInProgress = false;
      });
    this.merchandiseService
      .getAllMerchandiseCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.categories = result.data;
      });
  }

  addToCart(merhcandiseId: string): void {
    this.changeInProgress = true;
    this.shoppingCartService
      .addToShoppingCart(merhcandiseId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.shoppingCartModel = result.data;
        this.changeInProgress = false;
      });
  }

  removeFromCart(merhcandiseId: string): void {
    this.changeInProgress = true;
    this.shoppingCartService
      .removeFromShoppingCart(merhcandiseId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.shoppingCartModel = result.data;
        this.changeInProgress = false;
      });
  }

  updateCartItem(merhcandiseId: string, amount: number): void {
    this.changeInProgress = true;
    this.shoppingCartService
      .updateShoppingCartItem(merhcandiseId, amount)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.shoppingCartModel = result.data;
        this.changeInProgress = false;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
