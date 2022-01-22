import { ActionTypes } from "../actions.model";

export class SerializableChangeContext {
  public previousMathObjectString!: string;
  public newMathObjectString!: string;
  public previousHighlightObjectPositions: number[][] = [];
  public newHighlightObjectPositions: number[][] = [];
  public action!: ActionTypes;
}