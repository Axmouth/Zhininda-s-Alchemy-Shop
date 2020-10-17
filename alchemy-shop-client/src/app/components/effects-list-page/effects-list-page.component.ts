import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Effect } from 'src/app/models/api/effect';
import { MerchandiseService } from 'src/app/services/merchandise.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'zas-effects-list-page',
  templateUrl: './effects-list-page.component.html',
  styleUrls: ['./effects-list-page.component.scss'],
})
export class EffectsListPageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  effects: Effect[];

  constructor(private merchandiseService: MerchandiseService) {}

  ngOnInit(): void {
    this.initialise();
  }

  initialise(): void {
    this.merchandiseService
      .getAllMerchandiseEffects()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((effectResult) => {
        this.effects = effectResult.data;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
