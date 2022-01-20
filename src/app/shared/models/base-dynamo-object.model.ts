export class BaseDynamoObject {
  readonly id!: string;
  readonly partitionKey!: string;
  readonly sortKey!: string;
  readonly created!: string;
  readonly updated!: string;

  constructor(props: Partial<BaseDynamoObject>) {
    Object.assign(this, props);
  }
}