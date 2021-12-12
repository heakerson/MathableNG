import { TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Tan extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.tan;

    public copy(): Tan {
        return Trig.fromExpression<Tan>(this.expression, this.sign, this.trigType);
    }
}