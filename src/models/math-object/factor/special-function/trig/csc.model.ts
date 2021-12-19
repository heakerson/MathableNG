import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Csc extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.csc;

    public copy(): Csc {
        return Trig.fromFactor<Csc>(this.contents, this.sign, this.trigType);
    }
}