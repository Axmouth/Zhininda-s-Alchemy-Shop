import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AlertService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  private errorList = new BehaviorSubject<string[]>([]);
  private messageList = new BehaviorSubject<string[]>([]);
  private successMessageList = new BehaviorSubject<string[]>([]);

  constructor(private router: Router) {
    router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.messageList.next([]);
        this.errorList.next([]);
      }
    });
  }

  getMessageList(): Observable<string[]> {
    return this.messageList.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  setMessageList(messages: string[]): void {
    this.messageList.next(messages);
  }

  clearMessageList(): void {
    this.messageList.next([]);
  }

  getSuccessMessageList(): Observable<string[]> {
    return this.successMessageList.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  setSuccessMessageList(messages: string[]): void {
    this.successMessageList.next(messages);
  }

  clearSucessMessageList(): void {
    this.successMessageList.next([]);
  }

  getErrorList(): Observable<string[]> {
    return this.errorList.asObservable().pipe(takeUntil(this.ngUnsubscribe));
  }

  setErrorList(errors: string[]): void {
    this.errorList.next(errors);
  }

  clearErrorList(): void {
    this.errorList.next([]);
  }

  ngOnDestroy(): void {
    this.messageList.complete();
    this.successMessageList.complete();
    this.errorList.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
