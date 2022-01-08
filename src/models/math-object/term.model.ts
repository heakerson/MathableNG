import { ErrorHandler } from "../services/core/error-handler.service";
import { Factory } from "../services/core/factory.service";
import { StringFormatter } from "../services/core/string-formatter.service";
import { Sign } from "./enums.model";
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

    get isNegative(): boolean {
        return this.sign === Sign.Negative;
    }

    get sign(): Sign {
        return this.factors[0].sign;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(...factors: Factor[]): Term {
        let factorString = '';
        factors.forEach((term, i) => factorString += `${i > 0 ? '*' : ''}${term.toString()}`);

        return new Term(factorString);
    }

    public replaceChild(previousFactor: Factor, newFactor: Factor): Term {
        const newChildren = this.children.map(c => c.id === previousFactor.id ? newFactor : c) as Factor[];
        return Term.fromFactors(...newChildren);
    }

    public override copy(): Term {
        return new Term(this.toString());
    }

    public override toString(): string {
        let factorString = '';
        this.factors.forEach((f, i) => {
            const operator = i === 0 ? '' : '*';
            factorString += `${operator}${f}`;
        })

        return factorString;
    }

    public flipFirstFactorSign(): Term {
        return this.replaceChild(this.factors[0], this.factors[0].flipSign());
    }

    protected override setChildren(): Factor[] {
        return StringFormatter.parseFactorStrings(this.formattedInput).map(f => Factory.buildFactor(f));
    }

    protected override getFormattedInputString(): string {
        let formatted = super.getFormattedInputString();

        if (StringFormatter.parseTermStrings(formatted).length > 1) {
            formatted = `(${formatted})`;
        }
        return formatted;
    }

    protected override checkCustomFormattingErrors(): void {
        ErrorHandler.checkBaseChildErrors(this.inputWhitespaceRemoved, this.constructor.name);
    }
}