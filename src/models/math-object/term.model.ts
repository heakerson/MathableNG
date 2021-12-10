import { StringFormatter } from "../string-formatter.model";
import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject {

    constructor(input: string) {
        super(input);
    }

    protected override setChildren(): Factor[] {
        return StringFormatter.parseFactorStrings(this.formattedInput).map(f => StringFormatter.buildFactor(f));
    }

    copy(): Term {
        return new Term(this.formattedInput);
    }
}