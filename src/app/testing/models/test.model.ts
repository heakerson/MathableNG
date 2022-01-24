import { Solution } from 'src/models/services/math/solution/solution.model';
import * as uuid from 'uuid';
import { TestStatus } from './test-status.model';
export class Test {
  readonly id: string = uuid.v1();
  readonly input!: string;
  readonly solutionString: string = '';
  readonly count: number = 0;
  readonly final: string = '';
  readonly lastTestSolution!: string;
  readonly lastUpdated!: string;
  readonly created!: string;

  public get status(): TestStatus {
    if (!this.solutionString) {
      return TestStatus.NeedsApproval;
    }

    if (this.lastTestSolution) {
      return this.solutionString === this.lastTestSolution ? TestStatus.Pass : TestStatus.Fail;
    }

    return TestStatus.Pass;
  }

  public get Solution(): Solution {
    return Solution.fromString(this.solutionString);
  }

  public get formattedCreatedDate(): string {
    return new Date(this.created).toLocaleDateString();
  }

  public get formattedUpdatedDate(): string {
    if (this.lastUpdated) {
      return new Date(this.lastUpdated).toLocaleDateString();
    }
    
    return '';
  }

  constructor(props: Partial<Test>) {
    Object.assign(this, props);
  }

  public static init(editable: Partial<EditableTest>): Test {
    return new Test({...editable, created: new Date().toISOString() });
  }

  public edit(editable: Partial<EditableTest>): Test {
    return new Test({...this, ...editable});
  }
}

export class EditableTest {
  input!: string;
  solutionString: string = '';
  count: number = 0;
  final: string = '';
  lastTestSolution!: string;
  lastUpdated!: string;
}