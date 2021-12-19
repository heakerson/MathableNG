import { Factor } from "../factor.model";

export abstract class RealNumber extends Factor {

    public readonly value: number;

    constructor(input: string, value: number) {
        super(input);
        this.value = value;
    }
}