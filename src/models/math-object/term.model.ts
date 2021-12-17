import { StringFormatter } from "../services/string-formatter.model";
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

    public static fromFactors(...factors: Factor[]): Term {
        let factorString = '';
        factors.forEach((term, i) => factorString += `${i > 0 ? '*' : ''}${term.toString()}`);

        return new Term(factorString);
    }

    public getFactor<TFactor extends Factor>(index: number): TFactor {
        return this.getChild<TFactor>(index);
    }

    public appendFactors(...factors: Factor[]): Term {
        const newChildren = this.appendChildren<Factor>(...factors);
        return Term.fromFactors(...newChildren);
    }

    public prependFactors(...factors: Factor[]): Term {
        const newChildren = this.prependChildren<Factor>(...factors);
        return Term.fromFactors(...newChildren);
    }

    public insertFactors(index: number, ...factors: Factor[]): Term {
        const newChildren = this.insertChildren<Factor>(index, ...factors);
        return Term.fromFactors(...newChildren);
    }

    public removeFactors(...factors: Factor[]): Term {
        const newChildren = this.removeChildrenById<Factor>(...factors.map(f => f.id));
        return Term.fromFactors(...newChildren);
    }

    public removeFactorsAtIndices(...indices: number[]): Term {
        const newChildren = this.removeChildrenByIndex<Factor>(...indices);
        return Term.fromFactors(...newChildren);
    }

    public copy(): Term {
        return new Term(this.toString());
    }

    protected override setChildren(): Factor[] {
        return StringFormatter.parseFactorStrings(this.formattedInput).map(f => StringFormatter.buildFactor(f));
    }
}