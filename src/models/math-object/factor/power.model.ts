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

    protected override setChildren(): Factor[] {
        const { base, exponent } = StringFormatter.parsePowerFactor(this.formattedInput);
        return [ StringFormatter.buildFactor(base) , new Expression(exponent) ];
    }

    copy(): Power {
        return new Power(this.formattedInput);
    }
}