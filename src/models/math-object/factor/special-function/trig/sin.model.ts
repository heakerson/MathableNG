import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Sin extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.sin;
    
    public copy(): Sin {
        return Trig.fromExpression<Sin>(this.expression, this.sign, this.trigType);
    }
}