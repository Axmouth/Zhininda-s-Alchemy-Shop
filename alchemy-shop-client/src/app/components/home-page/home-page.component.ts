import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchandiseService } from '../../services/merchandise.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'zas-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  merchandises = [];

  constructor(
    private merchandiseService: MerchandiseService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });

    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    this.initialise();
  }

  initialise(): void {
    this.ngUnsubscribe.next();
    this.merchandiseService
      .getAllMerchandise({ preferred: true, pageSize: 6, page: 1 })
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
