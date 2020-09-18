import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorsService } from './services/errors.service';
import { MessagesService } from './services/messages.service';

@Component({
  selector: 'zas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  collapsed = true;
  searchForm = new FormGroup({
    search: new FormControl(''),
  });
  errors: string[] = [];
  messages: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private errorsService: ErrorsService,
    private messagesService: MessagesService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((qParams) => {
      this.searchForm.controls.search.setValue(qParams.search);
    });
    this.errorsService
      .getErrorList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((errors) => {
        this.errors = errors;
      });
    this.messagesService
      .getMessageList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  onSearchSubmit(): void {
    this.router.navigate(['merchandise', 'list'], { queryParams: { search: this.searchForm.controls.search.value } });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
