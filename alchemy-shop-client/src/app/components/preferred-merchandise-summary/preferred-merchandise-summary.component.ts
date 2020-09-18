import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Merchandise } from 'src/app/models/api/merchandise';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'zas-preferred-merchandise-summary',
  templateUrl: './preferred-merchandise-summary.component.html',
  styleUrls: ['./preferred-merchandise-summary.component.scss'],
})
export class PreferredMerchandiseSummaryComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  addingInProgress = false;
  @Input()
  merchandise: Merchandise;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {}

  onAddToCartClick(): void {
    this.addingInProgress = true;
    this.shoppingCartService
      .addToShoppingCart(this.merchandise.merchandiseId.toString(), 1)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.addingInProgress = false;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
