import { MathObject } from "../math-object.model";

export class Expression extends MathObject {

    constructor(input: string) {
        super(input);
    }

    clone(): Expression {
        return new Expression(this.input);
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}