import { BaseDynamoObject } from "@shared/models/base-dynamo-object.model";

export class BaseAppObject extends BaseDynamoObject {
  readonly objectType: any;
}