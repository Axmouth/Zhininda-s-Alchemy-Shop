import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchandiseService } from '../../services/merchandise.service';
import { Category } from '../../models/api/category';

@Component({
  selector: 'zas-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss'],
})
export class CategoryMenuComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  categories: Category[] = [];

  constructor(private merchandiseService: MerchandiseService) {}

  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    this.merchandiseService
      .getAllMerchandiseCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.categories = result.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
