import { Expression } from "./factor/expression.model";
import { MathObject } from "./math-object.model";

export class Equation extends MathObject {

    constructor(public readonly expressions: Expression[]) {
        super();
    }

    clone(): Equation {
        return new Equation(this.expressions.map(t => t.clone()));
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}