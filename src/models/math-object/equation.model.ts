import { StringFormatter } from "../services/core/string-formatter.service";
import { Expression } from "./factor/expression.model";
import { MathObject } from "./math-object.model";

export class Equation extends MathObject {

    get expressions(): Expression[] {
        return this.children as Expression[];
    }

    get expressionCount(): number {
        return this.children.length;
    }

    get isSingleExpression(): boolean {
        return this.expressionCount === 1;
    }

    constructor(input: string) {
        super(input);
    }

    public replaceChild(newMathObject: MathObject, previousMathObject: MathObject): MathObject {
        throw new Error("Method not implemented.");
    }

    public copy(): Equation {
        return new Equation(this.toString());
    }

    protected override setChildren(): Expression[] {
        return StringFormatter.parseExpressionStrings(this.formattedInput).map(e => new Expression(e));
    }
}