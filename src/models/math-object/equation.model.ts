import { StringFormatter } from "../string-formatter.model";
import { Expression } from "./factor/expression.model";
import { MathObject } from "./math-object.model";

export class Equation extends MathObject {

    public readonly expressions: Expression[];

    constructor(input: string) {
        super(input);
        this.expressions = StringFormatter.parseExpressionStrings(this.formattedInput).map(e => new Expression(e));
    }

    copy(): Equation {
        return new Equation(this.formattedInput);
    }
}