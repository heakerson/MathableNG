import { StringFormatter } from 'src/models/string-formatter.model';
import { Expression } from './expression.model';
import { Factor } from './factor.model';

export class Rational extends Factor {

    public readonly numerator: Expression;
    public readonly denominator: Expression;

    constructor(input: string) {
        super(input);
        const { numerator, denominator } = StringFormatter.parseRationalExpressions(this.formattedInput);
        this.numerator = new Expression(numerator);
        this.denominator = new Expression(denominator);
    }

    copy(): Rational {
        return new Rational(this.formattedInput);
    }
}