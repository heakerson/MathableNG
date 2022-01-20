import { BaseDynamoObject } from "@shared/models/base-dynamo-object.model";
import { Test } from "./test.model";

export class TestPage extends BaseDynamoObject {
  readonly tests: Test[] = [];

  constructor(props: Partial<TestPage>) {
    super(props);
    this.tests = props.tests?.map(t => new Test({ t })) || [];
  }
}