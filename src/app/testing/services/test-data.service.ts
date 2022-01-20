import { Injectable } from '@angular/core';
import { Config } from '@shared/models/config.model';
import { HttpClient } from '@angular/common/http';
import { BaseAppObject } from '@shared/models/base-testing-object.model';
import { TestingObjectType } from '@testing/models/testing-object-type.model';
import { TestConfiguration } from '@testing/models/test-configuration.model';
import { ReplaySubject } from 'rxjs';
import { TestPage } from '@testing/models/test-page.model';
import { Test } from '@testing/models/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {

  private readonly PARTITION_KEY = 'mathable-testing';
  private config = new Config();

  public readonly testConfig$ = new ReplaySubject<TestConfiguration>();
  public readonly testPages$ = new ReplaySubject<TestPage[]>();
  public readonly tests$ = new ReplaySubject<Test[]>();

  public testPages: TestPage[] = [];
  public testConfig!: TestConfiguration;

  constructor(private http: HttpClient) {
    this.testPages$.subscribe(pages => {
      this.testPages = pages || [];

      if (this.testPages.length) {
        let allTests: Test[] = [];
        this.testPages.forEach(p => allTests = allTests.concat(p.tests));
        this.tests$.next(allTests);
      }
    });

    this.testConfig$.subscribe(config => this.testConfig = config);
  }

  loadData(): void {
    this.http.get<BaseAppObject[]>(this.config.getUrl(this.PARTITION_KEY)).subscribe((data: BaseAppObject[]) => {
      const testConfig = data.find((d) => d.objectType === TestingObjectType.TestConfiguration) as TestConfiguration;
      const pages = data.filter(d => d.objectType === TestingObjectType.Page) as TestPage[];

      if (!testConfig) {
        this.initConfig();
      } else {
        this.testConfig$.next(new TestConfiguration(testConfig));
      }

      if (!pages || !pages.length) {
        this.addNewPage();
      } else {
        this.testPages$.next(pages.map(p => new TestPage(p)));
      }
    });
  }

  addNewPage(initPage: TestPage = TestPage.init(this.PARTITION_KEY, { tests: [] })): void {
    this.http.post<TestPage>(this.config.createUrl(), initPage).subscribe(
      (response) => this.testPages$.next([...this.testPages, new TestPage(response)]),
      (error) => {}
    );
  }

  updateObjects(objectsToUpdate: BaseAppObject[]): void {
    this.http.post<BaseAppObject[]>(this.config.updateUrl(), { items: objectsToUpdate }).subscribe(
      (response: BaseAppObject[]) => {
        const testConfig = response.find((d) => d.objectType === TestingObjectType.TestConfiguration) as TestConfiguration;
        const updatedPages = response.filter(d => d.objectType === TestingObjectType.Page) as TestPage[];

        if (testConfig) {
          this.testConfig$.next(new TestConfiguration(testConfig));
        }

        if (updatedPages && updatedPages.length) {
          const newList = this.testPages.map(currentPage => {
            const updatedPage = updatedPages.find(updatedPage => currentPage.id === updatedPage.id);
            return updatedPage ? new TestPage(updatedPage) : currentPage;
          });

          this.testPages$.next(newList);
        }
      },
      (error) => {}
    );
  }

  deleteObjects(objectsToUpdate: BaseAppObject[]): void {
    const deleteKeys = objectsToUpdate.map(o => {
      return { partitionKey: o.partitionKey, sortKey: o.sortKey };
    });

    this.http.post(this.config.deleteUrl(), { keys: deleteKeys }).subscribe(
      () => {
        const newPages = this.testPages.filter(p => !deleteKeys.some(k => p.partitionKey === k.partitionKey && p.sortKey === k.sortKey));

        if (this.testPages.length !== newPages.length) {
          this.testPages$.next(newPages);
        }
      },
      (error) => {}
    )
  }

  updateTests(updatedTests: Test[]): void {
    let allParentPages = this.testPages.filter(p => p.tests.some(t => !!updatedTests.find(updatedT => updatedT.id === t.id)));

    updatedTests.forEach(updatedTest => {
      const parentPage = this.testPages.find(p => p.tests.find(t => t.id === updatedTest.id));

      if (parentPage) {
        const newTestList = parentPage.tests.map(t => t.id === updatedTest.id ? updatedTest : t);
        const updatedPage = parentPage.edit({ tests: newTestList });
        allParentPages = allParentPages.map(p => updatedPage.id === p.id ? updatedPage : p);
      } else {
        throw new Error('COULD NOT FIND TEST PARENT TO UPDATE');
      }
    });

    if (allParentPages.length) {
      this.updateObjects(allParentPages);
    }
  }

  addNewTest(newTest: Test): void {
    const page = this.testPages.find(p => p.tests.length < this.testConfig.testsPerPage);

    if (page) {
      const newPage = page.edit({ tests: [...page.tests, newTest]});
      this.updateObjects([newPage]);
    } else {
      const newPage = TestPage.init(this.PARTITION_KEY, { tests: [newTest]});
      this.addNewPage(newPage);
    }
  }

  deleteTest(testToDelete: Test): void {
    const page = this.testPages.find(p => p.tests.length < this.testConfig.testsPerPage);

    if (page) {
      const newPage = page.edit({ tests: page.tests.filter(t => t.id !== testToDelete.id) });
      this.updateObjects([newPage]);
    } else {
      throw new Error('COULD NOT FIND TEST PARENT TO DELETE TEST FROM');
    }
  }

  private initConfig(): void {
    const initObject = TestConfiguration.init(this.PARTITION_KEY);

    this.http.post(this.config.createUrl(), initObject).subscribe(
      (response) => this.testConfig$.next(new TestConfiguration(response)),
      (error) => {}
    )
  }
}
