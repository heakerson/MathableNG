import { ActionTypes } from "../actions.model";

export class SerializableChangeContext {
  public previousMathObjectString!: string;
  public previousMathObjectType!: string;
  public newMathObjectString!: string;
  public newMathObjectType!: string;
  public previousHighlightObjectPositions: number[][] = [];
  public newHighlightObjectPositions: number[][] = [];
  public action!: ActionTypes;
}