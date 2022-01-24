import { SerializableChangeContext } from "./serializable-change-context.model";

export class SerializableSolution {
  changes!: SerializableChangeContext[];
  start!: string;
  startType!: string;
}