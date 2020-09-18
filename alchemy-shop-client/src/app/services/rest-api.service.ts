import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, switchMap, concatMap, map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from 'src/auth';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

function paramsToQuery(params: any): string {
  return Object.keys(params)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key]
          .map((value: string | number | boolean) => {
            if (value === undefined || value === null) {
              return '';
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          })
          .join('&');
      }
      if (params[key] === undefined || params[key] === null) {
        return '';
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .filter((s) => s !== '')
    .join('&');
}

@Injectable({
  providedIn: 'root',
})
export class RestApiService implements OnDestroy {
  static getReqCache = new Map<string, any>();
  ngUnsubscribe = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  static getFromCache<T>(url: string, queryParams: any): T {
    const queryString = paramsToQuery(queryParams);
    let newUrl = url;
    if (queryString && queryString.length > 0) {
      newUrl = `${newUrl}?${queryString}`;
    }
    return RestApiService.getReqCache.get(newUrl);
  }

  getAll<T>(baseUrl: string, queryParams: any, cached = false): Observable<T> {
    const url = `${baseUrl}`;

    return this.authService
      .isAuthenticatedOrRefresh()
      .pipe(
        concatMap(() => {
          return this.baseApiRequest<T>(url, queryParams, 'get', undefined, cached);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  get<T>(baseUrl: string, id: string, queryParams: any, cached = false): Observable<T> {
    const url = `${baseUrl}/${id}`;

    return this.authService
      .isAuthenticatedOrRefresh()
      .pipe(
        concatMap(() => {
          return this.baseApiRequest<T>(url, queryParams, 'get', undefined, cached);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  create<T>(baseUrl: string, body: any, queryParams: any): Observable<T> {
    const url = `${baseUrl}`;

    return this.authService
      .isAuthenticatedOrRefresh()
      .pipe(
        concatMap(() => {
          return this.baseApiRequest<T>(url, queryParams, 'post', body);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  update<T>(baseUrl: string, id: string, body: any, queryParams: any): Observable<T> {
    const url = `${baseUrl}/${id}`;

    return this.authService
      .isAuthenticatedOrRefresh()
      .pipe(
        concatMap(() => {
          return this.baseApiRequest<T>(url, queryParams, 'put', body);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  delete<T>(baseUrl: string, id: string, queryParams: any): Observable<T> {
    const url = `${baseUrl}/${id}`;

    return this.authService
      .isAuthenticatedOrRefresh()
      .pipe(
        concatMap(() => {
          return this.baseApiRequest<T>(url, queryParams, 'delete', undefined);
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  private baseApiRequest<T>(
    url: string,
    queryParams: any,
    method: HttpMethod,
    body: any,
    cached = false,
  ): Observable<T> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    const queryString = paramsToQuery(queryParams);
    let newUrl = url;
    if (queryString && queryString.length > 0) {
      newUrl = `${newUrl}?${queryString}`;
    }

    if (cached === true) {
      const cachedReq = RestApiService.getReqCache.get(newUrl);
      if (cachedReq !== undefined) {
        return of(cachedReq);
      }
    }

    return this.http
      .request<T>(method, newUrl, { body, headers, withCredentials: true })
      .pipe(retry(2))
      .pipe(
        map((response) => {
          RestApiService.getReqCache.set(newUrl, response);
          return response;
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // TODO Delete Many - Update Many - Create Many
}
