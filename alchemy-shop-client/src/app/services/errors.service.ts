import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  private errorList = new BehaviorSubject<string[]>([]);

  constructor(private router: Router) {
    router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorList.next([]);
      }
    });
  }

  getErrorList(): Observable<string[]> {
    return this.errorList.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  setErrorList(errors: string[]): void {
    this.errorList.next(errors);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.errorList.complete();
  }
}
