import { Expression } from "@angular/compiler";
import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { StringFormatter } from "src/models/string-formatter.model";
import { SpecialFunction } from "../special-function.model";

export abstract class Trig extends SpecialFunction {
    get functionString(): string {
        return this.trigType;
    }

    abstract readonly trigType: TrigTypes;

    public static fromExpression<TTrig extends Trig>(expression: Expression, sign: Sign, trigType: TrigTypes): TTrig {
        return StringFormatter.buildFactor(`${sign}${trigType}[${expression}]`) as TTrig;
    }
}