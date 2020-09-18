import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessagesService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  private messageList = new BehaviorSubject<string[]>([]);

  constructor(private router: Router) {
    router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.messageList.next([]);
      }
    });
  }

  getMessageList(): Observable<string[]> {
    return this.messageList.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  setMessageList(errors: string[]): void {
    this.messageList.next(errors);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.messageList.complete();
  }
}
