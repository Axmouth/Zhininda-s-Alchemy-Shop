import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchandiseService } from 'src/app/services/merchandise.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-merchandise-list-page',
  templateUrl: './merchandise-list-page.component.html',
  styleUrls: ['./merchandise-list-page.component.scss'],
})
export class MerchandiseListPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  ngUnsubscribeOnInit = new Subject<void>();
  merchandises = [];
  categoryName: string = undefined;
  search: string = undefined;
  showSearchHeader = false;
  showAllHeader = false;
  showCategoryHeader = false;

  constructor(private route: ActivatedRoute, private merchandiseService: MerchandiseService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`Merchandise List - Zhininda's Alchemy Shop`);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((qParams) => {
      this.categoryName = qParams.categoryName;
      this.search = qParams.search;
      this.initialise(this.categoryName, this.search);
    });
  }

  initialise(categoryName: string, search: string): void {
    this.ngUnsubscribeOnInit.next();
    this.showSearchHeader = (search || '') !== '';
    this.showCategoryHeader = (categoryName || '') !== '';
    this.showAllHeader = !(this.showCategoryHeader || this.showSearchHeader);
    if (this.showSearchHeader) {
      this.title.setTitle(`Merchandise Search: ${this.search} - Zhininda's Alchemy Shop`);
    }
    if (this.showCategoryHeader) {
      this.title.setTitle(`Merchandise Category: ${this.categoryName} - Zhininda's Alchemy Shop`);
    }
    this.merchandiseService
      .getPreferredMerchandise({ categoryName, search })
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(takeUntil(this.ngUnsubscribeOnInit))
      .subscribe((result) => {
        this.merchandises = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribeOnInit.next();
    this.ngUnsubscribeOnInit.complete();
  }
}
