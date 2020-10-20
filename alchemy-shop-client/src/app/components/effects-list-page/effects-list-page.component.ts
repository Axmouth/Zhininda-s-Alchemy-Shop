import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Effect } from 'src/app/models/api/effect';
import { MerchandiseService } from 'src/app/services/merchandise.service';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'zas-effects-list-page',
  templateUrl: './effects-list-page.component.html',
  styleUrls: ['./effects-list-page.component.scss'],
})
export class EffectsListPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  effects: Effect[];
  loading = false;

  constructor(
    private merchandiseService: MerchandiseService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Alchemical Effects List | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    this.initialise();
  }

  initialise(): void {
    this.loading = true;
    this.merchandiseService
      .getAllMerchandiseEffects()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((effectResult) => {
        this.effects = effectResult.data;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
