import { StringFormatter } from 'src/models/services/string-formatter.service';
import { Expression } from './expression.model';
import { Factor } from './factor.model';

export class Rational extends Factor {

    get numerator(): Expression {
        return this.children[0] as Expression;
    }

    get denominator(): Expression {
        return this.children[1] as Expression;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromExpressions(numerator: Expression, denominator: Expression): Rational {
        return new Rational(`(${numerator.toString()}/${denominator.toString()})`);
    }

    protected override setChildren(): Expression[] {
        const { numerator, denominator } = StringFormatter.parseRationalExpressions(this.formattedInput);
        return [ new Expression(numerator), new Expression(denominator) ];
    }

    copy(): Rational {
        return new Rational(this.toString());
    }
}