import { MathObject } from "src/models/math-object/math-object.model";
import { ChangeContext } from "./change-context.model";

export class Solution {
  changes!: ChangeContext[];

  get final(): MathObject {
    return this.changes[this.changes.length - 1].newMathObject;
  }

  constructor(props: Partial<Solution>) {
    Object.assign(this, props);
  }
}