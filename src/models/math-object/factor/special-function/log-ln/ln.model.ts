import { LogTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { LogLn } from "./log-ln.model";

export class Ln extends LogLn {

    public readonly logType: LogTypes = LogTypes.log;

    constructor(input: string) {
        super(input);
    }
    
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}