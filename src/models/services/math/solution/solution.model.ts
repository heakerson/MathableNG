import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "../../core/factory.service";
import { ChangeContext } from "./change-context.model";
import { SerializableSolution } from "./serializable-solution.model";

export class Solution {
  changes!: ChangeContext[];
  start!: MathObject;

  get final(): MathObject {
    if (this.changes?.length) {
      return this.changes[this.changes.length - 1]?.newMathObject;
    }

    return this.start;
  }

  constructor(props: Partial<Solution>) {
    Object.assign(this, props);
  }

  public equals(anotherSolution: Solution): boolean {
    return this.toString() === anotherSolution.toString();
  }

  public static fromString(solutionString: string): Solution {
    const serializable: SerializableSolution = JSON.parse(solutionString);
    return Solution.fromSerializable(serializable);
  }

  public static fromSerializable(serializable: SerializableSolution): Solution {
    return new Solution({
      changes: serializable.changes.map(c => ChangeContext.fromSerializable(c)),
      start: Factory.buildMathObject(serializable.start, serializable.startType)
    })
  }

  public toSerializable(): SerializableSolution {
    return {
      changes: this.changes.map(c => c.toSerializable()),
      start: this.start.toString(),
      startType: this.start.constructor.name
    };
  }

  public toString(): string {
    return JSON.stringify(this.toSerializable());
  }
}