import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { UrlMetaTagService } from './services/url-meta-tag.service';

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
  successMessages: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private urlMetaTagService: UrlMetaTagService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe((qParams) => {
      this.searchForm.controls.search.setValue(qParams.search);
    });
    this.alertService
      .getErrorList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((errors) => {
        this.errors = errors;
      });
    this.alertService
      .getMessageList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((messages) => {
        this.messages = messages;
      });
    this.alertService
      .getSuccessMessageList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((messages) => {
        this.successMessages = messages;
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
