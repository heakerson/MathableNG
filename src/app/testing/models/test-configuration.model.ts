import { BaseAppObject } from "@shared/models/base-testing-object.model";
import { TestingObjectType } from "./testing-object-type.model";

export class TestConfiguration extends BaseAppObject {
  readonly testsPerPage!: number;
  override readonly objectType: TestingObjectType = TestingObjectType.TestConfiguration;

  constructor(props: Partial<TestConfiguration>) {
    super(props);
  }
}