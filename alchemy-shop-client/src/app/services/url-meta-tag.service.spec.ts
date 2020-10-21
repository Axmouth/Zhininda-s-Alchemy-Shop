import { TestBed } from '@angular/core/testing';

import { UrlMetaTagService } from './url-meta-tag.service';

describe('UrlMetaTagService', () => {
  let service: UrlMetaTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlMetaTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
