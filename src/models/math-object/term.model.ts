import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject {

    public readonly factors: Factor[] = [];

    constructor(input: string) {
        super(input);
    }

    clone(): Term {
        return new Term(this.input);
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}