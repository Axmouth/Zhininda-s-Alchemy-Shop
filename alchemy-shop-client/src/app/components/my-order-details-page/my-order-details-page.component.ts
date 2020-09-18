import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/models/api/order';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zas-my-order-details-page',
  templateUrl: './my-order-details-page.component.html',
  styleUrls: ['./my-order-details-page.component.scss'],
})
export class MyOrderDetailsPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  order: Order;
  orderId: string;

  constructor(private orderService: OrderService, private route: ActivatedRoute, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`Order Details - Zhininda's Alchemy Shop`);
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
