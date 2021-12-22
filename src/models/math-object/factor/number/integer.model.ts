import { Double } from "./double.model";

export class Integer extends Double {

    get isEven() : boolean {
        return this.value % 2 === 0;
    }

    constructor(input: string) {
        super(input);
    }

    public static override fromNumber(number: number): Integer {
        return Double.fromNumber(number) as Integer;
    }
}