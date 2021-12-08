import { StringFormatter } from "src/models/string-formatter.model";
import { Expression } from "./expression.model";
import { Factor } from "./factor.model";

export class Power extends Factor {
    
    public readonly exponent: Expression;
    public readonly base: Expression;

    constructor(input: string) {
        super(input);
        const { exponent, base } = StringFormatter.parsePowerFactor(this.formattedInput);
        this.exponent = new Expression(exponent);
        this.base = new Expression(base);
    }

    clone(): Power {
        return new Power(this.formattedInput);
    }
}