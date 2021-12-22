import { RealNumber } from "./real-number.model";

export class Double extends RealNumber {

    constructor(input: string) {
        super(input, Number.parseFloat(input));
    }

    public static fromNumber(number: number): Double {
        return new Double(number.toString());
    }
}