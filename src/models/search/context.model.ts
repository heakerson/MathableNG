import { MathObject } from "../math-object/math-object.model";
import { Position } from "./position.model";

export class Context {

  public get isRoot(): boolean {
    return !this.parentContext;
  }

  public get parent(): MathObject|null {
    if (this.parentContext) {
      return this.parentContext.target;
    }
    return null;
  }

  public get root(): MathObject {
    if (this.parentContext) {
      return this.parentContext.root;
    } else {
      return this.target;
    }
  }

  constructor(
    public target: MathObject,
    public position: Position,
    public parentContext?: Context
  ) { }
}