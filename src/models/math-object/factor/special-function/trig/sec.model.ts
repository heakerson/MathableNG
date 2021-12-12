import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Sec extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.sec;
    
    public copy(): Sec {
        return Trig.fromExpression<Sec>(this.expression, this.sign, this.trigType);
    }
}