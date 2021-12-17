import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Expression } from "../../expression.model";
import { LogLn } from "./log-ln.model";

export class Ln extends LogLn {
    public readonly logType: LogTypes = LogTypes.log;

    constructor(expressionString: string, sign: Sign) {
        super(expressionString, sign, Math.E);
    }

    public static fromExpression(expression: Expression, sign: Sign): Ln {
        return Factory.buildFactor(`${sign}${LogTypes.ln}[${expression}]`) as Ln;
    }
    
    public copy(): Ln {
        return Ln.fromExpression(this.expression, this.sign);
    }
}