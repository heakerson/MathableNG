import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { Expression } from "./expression.model";
import { Factor } from "./factor.model";

export class Power extends Factor {

    get base(): Factor {
        return this.children[0] as Factor;
    }
    
    get exponent(): Factor {
        return this.children[1] as Factor;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(base: Factor, exponent: Factor): Power {
        return new Power(`${base.toString()}^${exponent.toString()}`);
    }

    public copy(): Power {
        return new Power(this.toString());
    }

    protected override setChildren(): Factor[] {
        const { base, exponent } = StringFormatter.parsePowerFactor(this.formattedInput);
        return [ Factory.buildFactor(base) , new Expression(exponent) ];
    }
}