import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSettings } from 'src/app/models/api/account-settings';
import { Order } from 'src/app/models/api/order';
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from '../../services/order.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'zas-my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.scss'],
})
export class MyOrdersPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  myOrders: Order[];

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`My Orders | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
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
