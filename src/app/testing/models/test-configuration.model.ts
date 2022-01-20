import { BaseAppObject } from "@shared/models/base-testing-object.model";
import { TestingObjectType } from "./testing-object-type.model";

export class TestConfiguration extends BaseAppObject {
  readonly testsPerPage!: number;
  override readonly objectType: TestingObjectType = TestingObjectType.TestConfiguration;

  constructor(props: Partial<TestConfiguration>) {
    super(props);
  }

  public static init(partitionKey: string): TestConfiguration {
    return new TestConfiguration({ partitionKey })
  }

  public edit(editable: Partial<EditableConfig>): TestConfiguration {
    return new TestConfiguration({...this, ...editable});
  }
}

export class EditableConfig {
  testsPerPage!: number;
}