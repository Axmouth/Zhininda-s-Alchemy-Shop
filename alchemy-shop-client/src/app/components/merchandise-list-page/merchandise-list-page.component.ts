import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchandiseService } from 'src/app/services/merchandise.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
  effectName: string = undefined;
  search: string = undefined;
  showSearchHeader = false;
  showEffectHeader = false;
  showAllHeader = false;
  showCategoryHeader = false;
  pageSize: number;
  pageNumber: number;
  totalResults: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Merchandise List | Zhininda's Alchemy Shop`);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((qParams) => {
      this.effectName = qParams.effectName;
      this.categoryName = qParams.categoryName;
      this.search = qParams.search;
      this.pageNumber = qParams.pageNumber ?? 1;
      this.pageSize = qParams.pageSize ?? 21;
      this.initialise();
    });
  }

  initialise(): void {
    this.ngUnsubscribeOnInit.next();
    this.showSearchHeader = (this.search || '') !== '';
    this.showCategoryHeader = (this.categoryName || '') !== '';
    this.showEffectHeader = (this.effectName || '') !== '';
    this.showAllHeader = !(this.showCategoryHeader || this.showSearchHeader);
    if (this.showSearchHeader) {
      this.title.setTitle(`Merchandise Search: ${this.search} - Zhininda's Alchemy Shop`);
    }
    if (this.showCategoryHeader) {
      this.title.setTitle(`Merchandise Category: ${this.categoryName} - Zhininda's Alchemy Shop`);
    }
    if (this.showEffectHeader) {
      this.title.setTitle(`Merchandise Effect: ${this.effectName} - Zhininda's Alchemy Shop`);
    }
    this.merchandiseService
      .getAllMerchandise({
        categoryName: this.categoryName,
        search: this.search,
        effectName: this.effectName,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(takeUntil(this.ngUnsubscribeOnInit))
      .subscribe((result) => {
        this.merchandises = result.data;
        this.totalResults = result.pagination.totalResults;
        this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
        this.meta.updateTag({
          name: `keywords`,
          content: `axmouth,developer,webdev,programmer,portfolio,${this.search},${this.categoryName},${this.effectName}`,
        });
        this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
        this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
        this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
        this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
      });
  }

  onPageChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pageNumber: this.pageNumber },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ngUnsubscribeOnInit.next();
    this.ngUnsubscribeOnInit.complete();
  }
}
