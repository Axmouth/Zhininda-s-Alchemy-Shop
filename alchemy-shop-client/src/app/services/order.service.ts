import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseResponse } from 'src/app/models/api/base-response';
import { Order } from 'src/app/models/api/order';
import { RestApiService } from 'src/app/services/rest-api.service';
import { apiRoot } from 'src/environments/environment';
import { CheckoutRequest } from '../models/api/checkout-request';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  orderUrl = `${apiRoot}orders`;
  orderDetailUrl = `${apiRoot}order-details`;

  constructor(private apiService: RestApiService) {}

  getAllMyOrders(query: object = {}): Observable<BaseResponse<Order[]>> {
    return this.apiService.getAll<BaseResponse<Order[]>>(this.orderUrl, query).pipe(takeUntil(this.ngUnsubscribe));
  }

  getOrder(orderId: string, query: object = {}): Observable<BaseResponse<Order>> {
    return this.apiService.get<BaseResponse<Order>>(this.orderUrl, orderId, query).pipe(takeUntil(this.ngUnsubscribe));
  }

  checkout(checkoutRequest: CheckoutRequest): Observable<BaseResponse<Order>> {
    return this.apiService
      .create<BaseResponse<Order>>(this.orderUrl, checkoutRequest, {})
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
