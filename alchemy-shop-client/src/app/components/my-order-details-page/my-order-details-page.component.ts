import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Order } from 'src/app/models/api/order';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { IsBrowserService } from 'src/auth/helpers/services/is-browser.service';

@Component({
  selector: 'zas-my-order-details-page',
  templateUrl: './my-order-details-page.component.html',
  styleUrls: ['./my-order-details-page.component.scss'],
})
export class MyOrderDetailsPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  order: Order;
  orderId: string;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private isBrowserService: IsBrowserService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Order Details | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    if (!this.isBrowserService.isInBrowser()) {
      return;
    }
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.orderId = params.orderId;
      this.initialise();
    });
  }

  initialise(): void {
    this.orderService
      .getOrder(this.orderId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.order = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
