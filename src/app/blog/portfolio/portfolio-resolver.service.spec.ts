import { TestBed } from '@angular/core/testing';

import { PortfolioResolverService } from './portfolio-resolver.service';

describe('PortfolioResolverService', () => {
  let service: PortfolioResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
