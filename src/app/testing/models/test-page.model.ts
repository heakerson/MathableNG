import { BaseAppObject } from "@shared/models/base-testing-object.model";
import { Test } from "./test.model";
import { TestingObjectType } from "./testing-object-type.model";

export class TestPage extends BaseAppObject {
  readonly tests: Test[] = [];
  override readonly objectType: TestingObjectType = TestingObjectType.Page;

  constructor(props: Partial<TestPage>) {
    super(props);
    this.tests = props.tests?.map(t => new Test(t)) || [];
  }

  public static init(partitionKey: string, editable: Partial<EditablePage>): TestPage {
    return new TestPage({ partitionKey, ...editable })
  }

  public edit(editable: Partial<EditablePage>): TestPage {
    return new TestPage({...this, ...editable});
  }
}

export class EditablePage {
  tests!: Test[];
}