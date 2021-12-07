import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject {
    constructor(public readonly factors: Factor[]) {
        super();
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}