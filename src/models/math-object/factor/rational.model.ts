import { Factory } from 'src/models/services/factory.service';
import { StringFormatter } from 'src/models/services/string-formatter.service';
import { Sign } from '../enums.model';
import { Factor } from './factor.model';

export class Rational extends Factor {

    get numerator(): Factor {
        return this.children[0] as Factor;
    }

    get denominator(): Factor {
        return this.children[1] as Factor;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(numerator: Factor, denominator: Factor): Rational {
        return new Rational(`(${numerator.toString()}/${denominator.toString()})`);
    }

    // public static fromFactors(numerator: Factor, denominator: Factor, sign: Sign): Rational {
    //     return new Rational(`${sign}(${numerator.toString()}/${denominator.toString()})`);
    // }

    public override toString(): string {
        return `(${this.numerator.toString()}/${this.denominator.toString()})`;
    }

    protected override setChildren(): Factor[] {
        const { numerator, denominator } = StringFormatter.parseRationalExpressions(this.formattedInput);
        return [ Factory.buildFactor(numerator) , Factory.buildFactor(denominator) ];
    }

    public override copy(): Rational {
        return new Rational(this.toString());
    }

    protected override getFormattedInputString(): string {
        const parentFormatted = super.getFormattedInputString();
        
        if (parentFormatted[0] === '-' && StringFormatter.getMatchingParenthesisIndex(parentFormatted, 1) === parentFormatted.length - 1) {
            return parentFormatted;
        }

        return StringFormatter.ensureSurroundingParenthesis(parentFormatted);
    }
}