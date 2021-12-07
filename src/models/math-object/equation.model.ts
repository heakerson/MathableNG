import { Factory } from "../factory.model";
import { Expression } from "./factor/expression.model";
import { MathObject } from "./math-object.model";

export class Equation extends MathObject {

    constructor(input: string) {
        super(input);
    }

    clone(): Equation {
        return new Equation(this.input);
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }
}