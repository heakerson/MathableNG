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

  dataSource: TestTableViewModel[] = [];

  @Input()
  set tests(tests: Test[]) {
    this.dataSource = this.buildDataList(tests) || [];
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

  deleteTest(test: Test): void {
    this.testDataService.deleteTest(test);
  }

  buildDataList(tests: Test[]): TestTableViewModel[] {
    return tests?.map(test => {
      return new TestTableViewModel({
        test,
        input: test.input,
        status: test.status,
        final: test.solutionString ? test.final : '-',
        count: test.solutionString ? test.count.toString() : '-',
        formattedUpdatedDate: test.lastUpdated ? test.formattedUpdatedDate : '-',
        formattedCreatedDate: test.created ? test.formattedCreatedDate : '-',
        statusStyles: this.getStatusStyling(test.status),
        solutionString: test.solutionString
      });
    });
  }

  getStatusStyling(status: TestStatus): any {
    switch (status) {
      case TestStatus.Pass:
        return {
          color: 'limegreen',
          'font-weight': 'bold'
        };
      case TestStatus.FailFinalSolution:
      case TestStatus.FailStepCount:
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
}

class TestTableViewModel {
  test!: Test;
  input!: string;
  status!: TestStatus;
  final!: string;
  count!: string;
  formattedUpdatedDate!: string;
  formattedCreatedDate!: string;
  solutionString!: string;
  statusStyles!: any;

  constructor(start: Partial<TestTableViewModel>) {
    Object.assign(this, start);
  }
}
