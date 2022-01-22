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

  public toSerializable(): SerializableChangeContext {
    return {
      previousMathObjectString: this.previousMathObject.toString(),
      newMathObjectString: this.newMathObject.toString(),
      previousMathObjectType: this.previousMathObject.constructor.name,
      newMathObjectType: this.newMathObject.constructor.name,
      previousHighlightObjectPositions: this.previousHighlightObjects.map(po => this.previousMathObject.getObjectById(po.id).position.indexPath),
      newHighlightObjectPositions: this.newHighlightObjects.map(no => this.newMathObject.getObjectById(no.id).position.indexPath),
      action: this.action
    } as SerializableChangeContext;
  }

  public equals(anotherChangeContext: ChangeContext): boolean {
    return this.toString() === anotherChangeContext.toString();
  }

  public toString(): string {
    return JSON.stringify(this.toSerializable());
  }

  public static fromSerializable(serializable: SerializableChangeContext): ChangeContext {
    const previousMathObject = Factory.buildMathObject(serializable.previousMathObjectType, serializable.previousMathObjectString);
    const newMathObject = Factory.buildMathObject(serializable.newMathObjectType, serializable.newMathObjectString);

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

  public static fromString(serialized: string): ChangeContext {
    const serializable: SerializableChangeContext = JSON.parse(serialized);
    return ChangeContext.fromSerializable(serializable);
  }
}