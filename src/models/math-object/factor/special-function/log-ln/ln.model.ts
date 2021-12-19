import { LogTypes, Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { LogLn } from "./log-ln.model";

export class Ln extends LogLn {
    public readonly logType: LogTypes = LogTypes.log;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'E');
    }

    public static fromFactor(factor: Factor, sign: Sign): Ln {
        return Factory.buildFactor(`${sign}${LogTypes.ln}[${factor}]`) as Ln;
    }
    
    public copy(): Ln {
        return Ln.fromFactor(this.contents, this.sign);
    }
}