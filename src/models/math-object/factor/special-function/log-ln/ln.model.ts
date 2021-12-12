import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { StringFormatter } from "src/models/string-formatter.model";
import { Expression } from "../../expression.model";
import { LogLn } from "./log-ln.model";

export class Ln extends LogLn {
    public readonly logType: LogTypes = LogTypes.log;

    constructor(expressionString: string) {
        super(expressionString, Math.E);
    }

    public static fromExpression(expression: Expression, sign: Sign): Ln {
        return StringFormatter.buildFactor(`${sign}${LogTypes.ln}[${expression}]`) as Ln;
    }
    
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}