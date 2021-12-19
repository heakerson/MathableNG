import { Factory } from "src/models/services/factory.service";
import { Sign } from "../../enums.model";
import { Factor } from "../factor.model";

export abstract class Function extends Factor {
    abstract readonly functionString: string;
    protected readonly fnSign: Sign;

    public override get sign(): Sign {
        return this.fnSign;
    }

    constructor(contentsStr: string, sign: Sign) {
        super(contentsStr);
        this.fnSign = sign;
    }

    public override toString(): string {
        return `${this.sign}${this.functionString}[${this.children[0].toString()}]`;
    }

    public override setChildren(): Factor[] {
        return [ Factory.buildFactor(this.formattedInput) ];
    }
}