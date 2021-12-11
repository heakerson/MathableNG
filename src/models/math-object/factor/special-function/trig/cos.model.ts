import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Cos extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.cos;

    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}