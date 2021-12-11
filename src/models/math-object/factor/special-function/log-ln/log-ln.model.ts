import { LogTypes } from "src/models/math-object/enums.model";
import { SpecialFunction } from "../special-function.model";

export abstract class LogLn extends SpecialFunction {

    abstract readonly logType: LogTypes;

    constructor(input: string) {
        super(input);
    }
}