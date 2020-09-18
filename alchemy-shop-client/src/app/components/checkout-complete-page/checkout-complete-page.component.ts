import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'zas-checkout-complete-page',
  templateUrl: './checkout-complete-page.component.html',
  styleUrls: ['./checkout-complete-page.component.scss'],
})
export class CheckoutCompletePageComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`Checkout Complete! - Zhininda's Alchemy Shop`);
  }
}
