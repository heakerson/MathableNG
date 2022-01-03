import { RealNumber } from "./real-number.model";

export class Double extends RealNumber {

    constructor(input: string) {
        super(input, Number.parseFloat(input));
    }

    public static fromNumber(number: number): Double {
        const isNegativeZero = Object.is(number,-0);
        const negativeZeroSign = isNegativeZero ? '-' : '';
        return new Double(`${negativeZeroSign}${number.toString()}`);
    }
}