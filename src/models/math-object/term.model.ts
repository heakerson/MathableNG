import { StringFormatter } from "../string-formatter.model";
import { Factor } from "./factor/factor.model";
import { MathObject } from "./math-object.model";

export class Term extends MathObject {

    get factors(): Factor[] {
        return this.children as Factor[];
    }

    get factorCount(): number {
        return this.children.length;
    }

    get isSingleFactor(): boolean {
        return this.factorCount === 1;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(factors: Factor[]): Term {
        let factorString = '';
        factors.forEach((term, i) => factorString += `${i > 0 ? '*' : ''}${term.toString()}`);

        return new Term(factorString);
    }

    public copy(): Term {
        return new Term(this.toString());
    }

    protected override setChildren(): Factor[] {
        return StringFormatter.parseFactorStrings(this.formattedInput).map(f => StringFormatter.buildFactor(f));
    }
}