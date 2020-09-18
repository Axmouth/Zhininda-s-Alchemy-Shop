import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSettings } from 'src/app/models/api/account-settings';
import { Order } from 'src/app/models/api/order';
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from '../../services/order.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.scss'],
})
export class MyOrdersPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  myOrders: Order[];

  constructor(private accountService: AccountService, private orderService: OrderService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`My Orders - Zhininda's Alchemy Shop`);
    this.initialise();
  }

  initialise(): void {
    this.orderService
      .getAllMyOrders()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.myOrders = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
