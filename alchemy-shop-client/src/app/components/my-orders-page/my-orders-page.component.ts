import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSettings } from 'src/app/models/api/account-settings';
import { Order } from 'src/app/models/api/order';
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from '../../services/order.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { IsBrowserService } from 'src/auth/helpers/services/is-browser.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'zas-my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.scss'],
})
export class MyOrdersPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  myOrders: Order[];
  pageSize: number;
  pageNumber: number;
  sortType: string;
  totalResults: number;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private orderService: OrderService,
    private isBrowserService: IsBrowserService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`My Orders | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    if (!this.isBrowserService.isInBrowser()) {
      return;
    }
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((qParams) => {
      this.pageNumber = qParams.pageNumber ?? 1;
      this.pageSize = qParams.pageSize ?? 20;
      this.sortType = qParams.sortType;
      this.initialise();
    });
  }

  initialise(): void {
    this.loading = true;
    this.orderService
      .getAllMyOrders({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortType: this.sortType,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.myOrders = result.data;
        this.totalResults = result.pagination.totalResults;
        this.loading = false;
      });
  }

  onPageChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pageNumber: this.pageNumber, pageSize: this.pageSize, sortType: this.sortType },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
