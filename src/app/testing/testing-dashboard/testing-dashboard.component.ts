import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestDataService } from '@testing/services/test-data.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-testing-dashboard',
  templateUrl: './testing-dashboard.component.html',
  styleUrls: ['./testing-dashboard.component.scss']
})
export class TestingDashboardComponent implements OnInit, OnDestroy {

  public destroyed$ = new Subject();

  constructor(
    private dataService: TestDataService
  ) { }

  ngOnInit(): void {
    this.dataService.loadData();

    this.dataService.testConfig$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((config) => console.log('TEST CONFIG!', config))

    this.dataService.testPages$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((pages) => console.log('PAGES!', pages))

    this.dataService.tests$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tests) => console.log('TESTS!', tests))
  }

  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

}
