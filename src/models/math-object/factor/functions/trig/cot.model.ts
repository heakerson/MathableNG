import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Cot extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'cot');
    }

    public static fromFactor(contents: Factor, sign: Sign): Cot {
        return Factory.buildFactor(`${sign}cot[${contents}]`) as Cot;
    }

    public replaceChild(newContents: Factor): Cot {
        return Cot.fromFactor(newContents, this.sign);
    }

    public override copy(): Cot {
        return Factory.buildFactor(`${this.sign}cot[${this.contents}]`) as Cot;
    }
}