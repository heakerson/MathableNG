import { MathObject } from "src/models/math-object/math-object.model";
import { Position } from "src/models/search/position.model";
import { Factory } from "../../core/factory.service";
import { ActionTypes } from "../actions.model";
import { SerializableChangeContext } from "./serializable-change-context.model";

export class ChangeContext {
  public previousMathObject!: MathObject;
  public newMathObject!: MathObject;
  public previousHighlightObjects: MathObject[] = [];
  public newHighlightObjects: MathObject[] = [];
  public action!: ActionTypes;

  constructor(props: Partial<ChangeContext>) {
      Object.assign(this, props);
  }

  toString(): string {
      const serializable = {
          previousMathObjectString: this.previousMathObject.toString(),
          newMathObjectString: this.newMathObject.toString(),
          // previousHighlightObjectPositions: this.previousHighlightObjects.map(mo => this.previousMathObject)
      } as SerializableChangeContext;

      return JSON.stringify(serializable);
  }

  public static fromString(serialized: string): ChangeContext {
      const serializable: SerializableChangeContext = JSON.parse(serialized);
      const previousMathObject = Factory.buildFactor(serializable.previousMathObjectString);
      const newMathObject = Factory.buildFactor(serializable.newMathObjectString);

      return new ChangeContext({
          previousMathObject,
          newMathObject,
          previousHighlightObjects: serializable.previousHighlightObjectPositions.map(p => {
              const position = new Position(p);
              return previousMathObject.getObjectAtPosition(position) as MathObject;
          }),
          newHighlightObjects: serializable.newHighlightObjectPositions.map(p => {
              const position = new Position(p);
              return newMathObject.getObjectAtPosition(position) as MathObject;
          }),
          action: serializable.action
      });
  }
}