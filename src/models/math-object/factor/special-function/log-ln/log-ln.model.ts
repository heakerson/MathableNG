import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { Factor } from "../../factor.model";
import { Function } from "../function.model";

export abstract class LogLn extends Function {

    get functionString(): string {
        return this.logType;
    }

    get contents(): Factor {
        return this.getChild<Factor>(0)
    }

    abstract readonly logType: LogTypes;
    public abstract override copy(): LogLn;

    constructor(contentStr: string, sign: Sign, public readonly base: string) {
        super(contentStr, sign);
    }

    public override toString(): string {
        return `${this.sign}${this.functionString}[${this.children[0].toString()},${this.base}]`;
    }
}