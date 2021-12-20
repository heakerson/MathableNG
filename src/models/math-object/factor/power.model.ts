import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { Sign } from "../enums.model";
import { Factor } from "./factor.model";

export class Power extends Factor {

    get base(): Factor {
        return this.children[0] as Factor;
    }
    
    get exponent(): Factor {
        return this.children[1] as Factor;
    }

    override get sign(): Sign {
        return this.base.sign;
    }

    constructor(input: string) {
        super(input);
    }

    public static fromFactors(base: Factor, exponent: Factor): Power {
        return new Power(`${base.toString()}^${exponent.toString()}`);
    }

    public override copy(): Power {
        return new Power(this.toString());
    }

    public override toString(): string {
        return `${this.base.toString()}^${this.exponent.toString()}`;
    }

    protected override setChildren(): Factor[] {
        let { base, exponent } = StringFormatter.parsePowerFactor(this.formattedInput);

        if (StringFormatter.parseFactorStrings(base).length > 1 || StringFormatter.parseTermStrings(base).length > 1) {
            base = `(${base})`;
        }

        const parsedExponent = StringFormatter.parsePowerFactor(exponent);
        if (!!parsedExponent.exponent) {
            exponent = `(${exponent})`;
        }

        return [ Factory.buildFactor(base) , Factory.buildFactor(exponent) ];
    }
}