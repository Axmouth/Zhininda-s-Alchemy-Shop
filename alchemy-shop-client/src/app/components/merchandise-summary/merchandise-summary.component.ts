import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Merchandise } from 'src/app/models/api/merchandise';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'zas-merchandise-summary',
  templateUrl: './merchandise-summary.component.html',
  styleUrls: ['./merchandise-summary.component.scss'],
})
export class MerchandiseSummaryComponent implements OnInit, OnDestroy {
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
