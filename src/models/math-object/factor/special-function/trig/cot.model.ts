import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Cot extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.cot;

    public copy(): Cot {
        return Trig.fromExpression<Cot>(this.expression, this.sign, this.trigType);
    }
}