import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
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

    public override copy(): Power {
        return new Power(this.toString());
    }

    public override toString(): string {
        const exp = this.exponent instanceof Power ? `(${this.exponent.toString()})` : this.exponent.toString();
        return `${this.sign}${this.base.toString()}^${exp}`;
    }

    protected override setChildren(): Factor[] {
        let { base, exponent } = StringFormatter.parsePowerFactor(this.formattedInput);

        if (base[0] === '-') {
            base = base.substring(1);
        }

        return [ Factory.buildFactor(base) , Factory.buildFactor(exponent) ];
    }
}