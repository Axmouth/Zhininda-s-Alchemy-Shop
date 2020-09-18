import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RestApiService } from './rest-api.service';
import { ShoppingCartItem } from '../models/api/shopping-cart-item';
import { apiRoot } from 'src/environments/environment';
import { BaseResponse } from '../models/api/base-response';
import { ShoppingCart } from '../models/api/shopping-cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService implements OnDestroy {
  shoppingCartUrl = `${apiRoot}shopping-cart`;
  ngUnsubscribe = new Subject<void>();
  private cartItemAmount = new BehaviorSubject<number>(0);
  private cartTotalPrice = new BehaviorSubject<number>(0);

  constructor(private apiService: RestApiService) {
    this.reload();
  }

  reload(): void {
    this.getCartItems().subscribe((result) => {
      this.cartItemAmount.next(result.data.shoppingCart.shoppingCartItems.length);
      this.cartTotalPrice.next(result.data.shoppingCartTotal);
    });
  }

  getCartItemAmount(): Observable<number> {
    return this.cartItemAmount.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  getCartTotalPrice(): Observable<number> {
    return this.cartTotalPrice.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  getCartItems(): Observable<BaseResponse<ShoppingCart>> {
    return this.apiService
      .getAll<BaseResponse<ShoppingCart>>(this.shoppingCartUrl, {}, false)
      .pipe(
        map((result) => {
          this.cartItemAmount.next(result.data.shoppingCart.shoppingCartItems.length);
          this.cartTotalPrice.next(result.data.shoppingCartTotal);
          return result;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  addToShoppingCart(merchandiseId: string, amount: number = 1): Observable<BaseResponse<ShoppingCart>> {
    return this.apiService
      .create<BaseResponse<ShoppingCart>>(`${this.shoppingCartUrl}/${merchandiseId}`, {}, { amount })
      .pipe(
        map((result) => {
          this.cartItemAmount.next(result.data.shoppingCart.shoppingCartItems.length);
          this.cartTotalPrice.next(result.data.shoppingCartTotal);
          return result;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  updateShoppingCartItem(merchandiseId: string, amount: number): Observable<BaseResponse<ShoppingCart>> {
    return this.apiService
      .update<BaseResponse<ShoppingCart>>(this.shoppingCartUrl, merchandiseId, {}, { amount })
      .pipe(
        map((result) => {
          this.cartItemAmount.next(result.data.shoppingCart.shoppingCartItems.length);
          this.cartTotalPrice.next(result.data.shoppingCartTotal);
          return result;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  removeFromShoppingCart(merchandiseId: string, amount: number = 1): Observable<BaseResponse<ShoppingCart>> {
    return this.apiService
      .delete<BaseResponse<ShoppingCart>>(this.shoppingCartUrl, merchandiseId, { amount })
      .pipe(
        map((result) => {
          this.cartItemAmount.next(result.data.shoppingCart.shoppingCartItems.length);
          this.cartTotalPrice.next(result.data.shoppingCartTotal);
          return result;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
