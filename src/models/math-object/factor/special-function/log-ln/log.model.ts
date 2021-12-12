import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { StringFormatter } from "src/models/string-formatter.model";
import { Expression } from "../../expression.model";
import { LogLn } from "./log-ln.model";

export class Log extends LogLn {

    public readonly logType: LogTypes = LogTypes.log;

    constructor(expressionString: string, logBase: number = 10) {
        super(expressionString, logBase);
    }

    public static fromExpression(expression: Expression, sign: Sign, base: number = 10): Log {
        return StringFormatter.buildFactor(`${sign}${LogTypes.log}[${expression},${base}]`) as Log;
    }

    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}