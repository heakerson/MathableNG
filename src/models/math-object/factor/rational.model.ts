import { ErrorCodes, ErrorHandler } from 'src/models/services/error-handler.service';
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

    public static fromFactors(numerator: Factor, denominator: Factor, sign: Sign): Rational {
        return new Rational(`${sign}(${numerator.toString()}/${denominator.toString()})`);
    }

    public replaceChild(previousFactor: Factor, newFactor: Factor): Rational {
        const newChildren = this.children.map(c => c.id === previousFactor.id ? newFactor : c) as Factor[];
        return Rational.fromFactors(newChildren[0], newChildren[1], this.sign);
    }

    public override toString(): string {
        return `${this.sign}(${this.numerator.toString()}/${this.denominator.toString()})`;
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

    protected override checkCustomFormattingErrors(): void {
        const { numerator, denominator } = StringFormatter.parseRationalExpressions(this.inputWhitespaceRemoved);

        if (!numerator || !denominator) {
            ErrorHandler.throwError(ErrorCodes.Rational.MISSING_NUM_OR_DENOM, this.constructor.name, this.inputWhitespaceRemoved, 'Missing numerator or denominator');
        }

        ErrorHandler.checkBaseChildErrors(this.inputWhitespaceRemoved, this.constructor.name);
    }
}