import * as uuid from 'uuid';
export class Test {
  readonly id: string = uuid.v1();
  readonly input!: string;

  constructor(props: Partial<Test>) {
    Object.assign(this, props);
  }

  public static init(editable: Partial<EditableTest>): Test {
    return new Test({...editable});
  }

  public edit(editable: Partial<EditableTest>): Test {
    return new Test({...this, ...editable});
  }
}

export class EditableTest {
  input!: string;
}