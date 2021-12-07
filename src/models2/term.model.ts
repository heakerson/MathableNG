import { Addable } from "../interfaces/addable.interface";
import { MathObject } from "./math-object.model";
import { Multipliable } from "../interfaces/multipliable.interface";

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
}