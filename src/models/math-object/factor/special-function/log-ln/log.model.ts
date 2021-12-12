import { LogTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { LogLn } from "./log-ln.model";

export class Log extends LogLn {

    public readonly logType: LogTypes = LogTypes.log;

    constructor(expressionString: string, logBase: number = 10) {
        super(expressionString, logBase);
    }

    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}