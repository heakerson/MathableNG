import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';
import { TestStatus } from '@testing/models/test-status.model';
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

  displayedColumns: string[] = ['input', 'status', 'final', 'count', 'updatad', 'created', 'menu' ];

  constructor(
    private testDataService: TestDataService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }
  
  openSolution(test: Test): void {
    this.modalService.openSolutionModal(test.Solution);
  }

  getStatusStyling(status: TestStatus): any {
    switch (status) {
      case TestStatus.Pass:
        return {
          color: 'limegreen',
          'font-weight': 'bold'
        };
      case TestStatus.Fail:
        return {
          color: 'red',
          'font-weight': 'bold'
        };
      case TestStatus.NeedsApproval:
        return {
          color: 'orange',
          'font-weight': 'bold'
        };
    }
  }

  deleteTest(test: Test): void {
    this.testDataService.deleteTest(test);
  }

}
