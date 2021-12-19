import { MathObject } from "src/models/math-object/math-object.model";
import { RealNumber } from "./real-number.model";

export class Double extends RealNumber {

    constructor(input: string) {
        super(input, Number.parseFloat(input));
    }

    public copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}