import { ErrorCodes, ErrorHandler } from "src/models/services/error-handler.service";
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

    public replaceChild(previousFactor: Factor, newFactor: Factor): Power {
        const newChildren = this.children.map(c => c.id === previousFactor.id ? newFactor : c) as Factor[];
        return Power.fromFactors(newChildren[0], newChildren[1]);
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

    protected override checkCustomFormattingErrors(): void {
        let { base, exponent } = StringFormatter.parsePowerFactor(this.inputWhitespaceRemoved);

        if (!base || !exponent) {
            ErrorHandler.throwError(ErrorCodes.Power.MISSING_BASE_OR_EXPONENT, this.constructor.name, this.inputWhitespaceRemoved, 'Missing base or exponent');
        }

        ErrorHandler.checkBaseChildErrors(this.inputWhitespaceRemoved, this.constructor.name);
    }
}