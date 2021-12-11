import { Factor } from "../factor.model";

export abstract class RealNumber extends Factor {

    get value(): number {
        return Number.parseFloat(this.formattedInput);
    }
}