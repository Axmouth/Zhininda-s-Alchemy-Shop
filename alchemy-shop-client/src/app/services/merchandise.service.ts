import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Merchandise } from '../models/api/merchandise';
import { BaseResponse } from '../models/api/base-response';
import { RestApiService } from './rest-api.service';
import { apiRoot } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../models/api/category';

@Injectable({
  providedIn: 'root',
})
export class MerchandiseService implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  merchandiseUrl = `${apiRoot}merchandises`;
  categoryUrl = `${apiRoot}categories`;
  effectUrl = `${apiRoot}effects`;

  constructor(private apiService: RestApiService) {}

  getPreferredMerchandise(query: any = {}): Observable<BaseResponse<Merchandise[]>> {
    return this.apiService
      .getAll<BaseResponse<Merchandise[]>>(`${this.merchandiseUrl}`, query, true)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  getAllMerchandise(query: any = {}): Observable<BaseResponse<Merchandise[]>> {
    return this.apiService
      .getAll<BaseResponse<Merchandise[]>>(`${this.merchandiseUrl}`, query, true)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  getMerchandise(id: string, query: any = {}): Observable<BaseResponse<Merchandise>> {
    return this.apiService
      .get<BaseResponse<Merchandise>>(`${this.merchandiseUrl}`, id, query, true)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  getAllMerchandiseCategories(query: any = {}): Observable<BaseResponse<Category[]>> {
    return this.apiService
      .getAll<BaseResponse<Category[]>>(`${this.categoryUrl}`, query, true)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  getAllMerchandiseEffects(query: any = {}): Observable<BaseResponse<Category[]>> {
    return this.apiService
      .getAll<BaseResponse<Category[]>>(`${this.effectUrl}`, query, true)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
