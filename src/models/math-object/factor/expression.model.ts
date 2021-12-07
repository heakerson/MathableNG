import { MathObject } from "../math-object.model";
import { Term } from "../term.model";

export class Expression extends MathObject {

    constructor(public readonly terms: Term[]) {
        super();
    }

    clone(): Expression {
        return new Expression(this.terms.map(t => t.clone()));
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}