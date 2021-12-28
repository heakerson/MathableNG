import { ErrorHandler } from "src/models/services/error-handler.service";
import { Factory } from "src/models/services/factory.service";
import { Sign } from "../../enums.model";
import { Factor } from "../factor.model";

export abstract class Function extends Factor {
    public readonly functionString: string;
    protected readonly fnSign: Sign;
    public parameters: string[];

    public override get sign(): Sign {
        return this.fnSign;
    }

    constructor(rawParametersString: string, sign: Sign, fnString: string) {
        super(rawParametersString);
        this.fnSign = sign;
        this.functionString = this.setFnString(fnString);
        this.parameters = this.formattedInput.split(',');
    }

    public override toString(): string {
        const parameters = this.children.map(c => c.toString()).join(',');
        return `${this.sign}${this.functionString}[${parameters}]`;
    }

    protected override setChildren(): Factor[] {
        const parameters = this.formattedInput.split(',');
        return parameters.map(p => Factory.buildFactor(p));
    }

    protected setFnString(defaultSt: string): string {
        return defaultSt;
    }

    protected override checkCustomFormattingErrors(): void {
        const params = this.inputWhitespaceRemoved.split(',');
        params.forEach(p => ErrorHandler.checkBaseChildErrors(p, this.constructor.name, `[${params}] => ${p}`));
    }
}