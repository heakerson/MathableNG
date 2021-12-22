import { RealNumber } from "./real-number.model";

export class Double extends RealNumber {

    constructor(input: string) {
        super(input, Number.parseFloat(input));
    }
}