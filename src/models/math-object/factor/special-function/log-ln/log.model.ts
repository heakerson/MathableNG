import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { LogLn } from "./log-ln.model";

export class Log extends LogLn {

    public readonly logType: LogTypes = LogTypes.log;

    constructor(expressionString: string, sign: Sign, logBase: string = '10') {
        super(expressionString, sign, logBase);
    }

    public static fromFactor(factor: Factor, sign: Sign, base: string = '10'): Log {
        return Factory.buildFactor(`${sign}${LogTypes.log}[${factor},${base}]`) as Log;
    }

    public copy(): Log {
        return Log.fromFactor(this.contents, this.sign, this.base);
    }
}