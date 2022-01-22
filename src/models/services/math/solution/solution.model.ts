import { MathObject } from "src/models/math-object/math-object.model";
import { ChangeContext } from "./change-context.model";
import { SerializableSolution } from "./serializable-solution.model";

export class Solution {
  changes!: ChangeContext[];

  get final(): MathObject {
    return this.changes[this.changes.length - 1].newMathObject;
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
      changes: serializable.changes.map(c => ChangeContext.fromSerializable(c))
    })
  }

  public toSerializable(): SerializableSolution {
    return {
      changes: this.changes.map(c => c.toSerializable())
    };
  }

  public toString(): string {
    return JSON.stringify(this.toSerializable());
  }
}