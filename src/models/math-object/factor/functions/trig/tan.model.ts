import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Tan extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'tan');
    }

    public static fromFactor(contents: Factor, sign: Sign): Tan {
        return Factory.buildFactor(`${sign}tan[${contents}]`) as Tan;
    }

    public override copy(): Tan {
        return Factory.buildFactor(`${this.sign}tan[${this.contents}]`) as Tan;
    }
}