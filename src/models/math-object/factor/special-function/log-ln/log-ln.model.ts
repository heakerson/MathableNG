import { LogTypes } from "src/models/math-object/enums.model";
import { SpecialFunction } from "../special-function.model";

export abstract class LogLn extends SpecialFunction {
    get functionString(): string {
        return this.logType;
    }

    abstract readonly logType: LogTypes;

    constructor(expressionString: string, public readonly base: number) {
        super(expressionString);
    }
}