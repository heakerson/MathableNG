import { StringFormatter } from "src/models/string-formatter.model";
import { Expression } from "./expression.model";
import { Factor } from "./factor.model";

export class Power extends Factor {

    get base(): Factor {
        return this.children[0] as Factor;
    }
    
    get exponent(): Expression {
        return this.children[1] as Expression;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(base: Factor, exponent: Expression): Power {
        return new Power(`${base.toString()}^${exponent.toString()}`);
    }

    public copy(): Power {
        return new Power(this.formattedInput);
    }

    protected override setChildren(): Factor[] {
        const { base, exponent } = StringFormatter.parsePowerFactor(this.formattedInput);
        return [ StringFormatter.buildFactor(base) , new Expression(exponent) ];
    }
}