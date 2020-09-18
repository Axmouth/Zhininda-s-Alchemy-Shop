import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchandiseService } from '../../services/merchandise.service';

@Component({
  selector: 'zas-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  merchandises = [];

  constructor(private merchandiseService: MerchandiseService) {}

  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    this.ngUnsubscribe.next();
    this.merchandiseService
      .getPreferredMerchandise({ preferred: true })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.merchandises = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
