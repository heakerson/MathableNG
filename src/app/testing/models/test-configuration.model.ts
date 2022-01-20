import { BaseDynamoObject } from "@shared/models/base-dynamo-object.model";

export class TestConfiguration extends BaseDynamoObject {
  readonly testsPerPage!: number;

  constructor(props: Partial<TestConfiguration>) {
    super(props);
  }
}