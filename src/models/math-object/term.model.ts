import { Addable } from "../../interfaces/addable.interface";
import { Multipliable } from "../../interfaces/multipliable.interface";
import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject implements Addable<Term>, Multipliable<Term> {
    add(mathObject: Term): Term {
        throw new Error("Method not implemented.");
    }
    multiply(mathObject: Term): Term {
        throw new Error("Method not implemented.");
    }
    toString(): string {
        throw new Error("Method not implemented.");
    }

    constructor(public readonly factors: Factor[]) {
        super();
    }
}