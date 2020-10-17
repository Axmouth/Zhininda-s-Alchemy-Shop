import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { IsBrowserService } from 'src/auth/helpers/services/is-browser.service';

@Component({
  selector: 'zas-checkout-complete-page',
  templateUrl: './checkout-complete-page.component.html',
  styleUrls: ['./checkout-complete-page.component.scss'],
})
export class CheckoutCompletePageComponent implements OnInit {
  constructor(
    private isBrowserService: IsBrowserService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Checkout Complete! | Zhininda's Alchemy Shop`);
    this.meta.updateTag({ name: `title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `og:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `og:title`, content: this.title.getTitle() });
    this.meta.updateTag({ property: `twitter:url`, content: this.doc.location.href });
    this.meta.updateTag({ property: `twitter:title`, content: this.title.getTitle() });
    if (!this.isBrowserService.isInBrowser()) {
      return;
    }
  }
}
