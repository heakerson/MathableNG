import { Factory } from "src/models/services/factory.service";
import { Sign } from "../../enums.model";
import { Factor } from "../factor.model";

export abstract class Function extends Factor {
    public readonly functionString: string;
    protected readonly fnSign: Sign;

    public override get sign(): Sign {
        return this.fnSign;
    }

    constructor(parameters: string, sign: Sign, fnString: string) {
        super(parameters);
        this.fnSign = sign;
        this.functionString = fnString;
    }

    public override toString(): string {
        const parameters = this.children.map(c => c.toString()).join(',');
        return `${this.sign}${this.functionString}[${parameters}]`;
    }

    protected override setChildren(): Factor[] {
        const parameters = this.formattedInput.split(',');
        return parameters.map(p => Factory.buildFactor(p));
    }
}