import { MathObject } from "../math-object/math-object.model";
import { Position } from "./position.model";

export class Context {

  public get typeString(): string {
    return this.target.constructor.name;
  }

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

  public get siblings(): MathObject[] {
    if (this.parentContext) {
      return this.parentContext.target.children.filter(c => c.id !== this.target.id);
    }

    return [];
  }

  get isFirstSibling(): boolean {
    return this.position.index === 0;
  }

  public get isNumerator(): boolean {
    if (this.parent && this.parent.constructor.name === 'Rational') {
      return this.position.index === 0;
    }

    return false;
  }

  public get isDenominator(): boolean {
    if (this.parent && this.parent.constructor.name === 'Rational') {
      return this.position.index === 1;
    }

    return false;
  }

  constructor(
    public target: MathObject,
    public position: Position,
    public parentContext?: Context
  ) { }
}