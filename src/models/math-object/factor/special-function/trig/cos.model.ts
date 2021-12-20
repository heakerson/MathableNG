import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Cos extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'cos');
    }

    public static fromFactor(contents: Factor, sign: Sign): Cos {
        return Factory.buildFactor(`${sign}cos[${contents}]`) as Cos;
    }

    public override copy(): Cos {
        return Factory.buildFactor(`${this.sign}cos[${this.contents}]`) as Cos;
    }
}