import { StringFormatter } from "../factory.model";
import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject {

    public readonly factors: Factor[] = [];

    constructor(input: string) {
        super(input);
        this.factors = StringFormatter.parseFactorStrings(this.formattedInput).map(f => StringFormatter.buildFactor(f));
    }

    clone(): Term {
        return new Term(this.formattedInput);
    }
}