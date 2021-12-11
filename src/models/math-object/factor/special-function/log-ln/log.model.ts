import { LogTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { LogLn } from "./log-ln.model";

export class Log extends LogLn {

    public readonly logType: LogTypes = LogTypes.log;
    public readonly base: number;

    constructor(input: string) {
        super(input);
        this.base = this.parseBase();
    }

    private parseBase(): number {
        return 10;
    }

    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}