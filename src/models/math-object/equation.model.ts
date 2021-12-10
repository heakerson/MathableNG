import { StringFormatter } from "../string-formatter.model";
import { Expression } from "./factor/expression.model";
import { MathObject } from "./math-object.model";

export class Equation extends MathObject {

    constructor(input: string) {
        super(input);
    }

    protected override setChildren(): Expression[] {
        return StringFormatter.parseExpressionStrings(this.formattedInput).map(e => new Expression(e));
    }

    copy(): Equation {
        return new Equation(this.formattedInput);
    }
}