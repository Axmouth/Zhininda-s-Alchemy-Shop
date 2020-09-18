import { Component, OnInit, OnDestroy } from '@angular/core';
import { Merchandise } from '../../models/api/merchandise';
import { MerchandiseService } from '../../services/merchandise.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-merchandise-details-page',
  templateUrl: './merchandise-details-page.component.html',
  styleUrls: ['./merchandise-details-page.component.scss'],
})
export class MerchandiseDetailsPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  merchandise: Merchandise;
  merchandiseId: string;
  addingInProgress = false;

  constructor(
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService,
    private shoppingCartService: ShoppingCartService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Merchandise Details - Zhininda's Alchemy Shop`);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.merchandiseId = params.merchandiseId;
      this.initialise();
    });
  }

  initialise(): void {
    this.merchandiseService
      .getMerchandise(this.merchandiseId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.merchandise = result.data;
          this.title.setTitle(`${this.merchandise.name} - Zhininda's Alchemy Shop`);
        },
        (err) => {
          console.log(err);
        },
      );
  }

  onAddToCartClick(): void {
    this.addingInProgress = true;
    this.shoppingCartService
      .addToShoppingCart(this.merchandiseId.toString(), 1)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.addingInProgress = false;
        },
        (err) => {
          console.log(err);
        },
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
