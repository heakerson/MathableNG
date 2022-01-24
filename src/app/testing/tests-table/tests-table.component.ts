import { Component, Input, OnInit } from '@angular/core';
import { Test } from '@testing/models/test.model';
import { TestDataService } from '@testing/services/test-data.service';

@Component({
  selector: 'app-tests-table',
  templateUrl: './tests-table.component.html',
  styleUrls: ['./tests-table.component.scss']
})
export class TestsTableComponent implements OnInit {

  dataSource: Test[] = [];

  @Input()
  set tests(tests: Test[]) {
    this.dataSource = tests || [];
  }

  displayedColumns: string[] = ['input', 'final', 'count', 'menu'];

  constructor(
    private testDataService: TestDataService
  ) { }

  ngOnInit(): void {
  }

  deleteTest(test: Test): void {
    this.testDataService.deleteTest(test);
  }

}
