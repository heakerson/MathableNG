import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Csc extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'csc');
    }

    public static fromFactor(contents: Factor, sign: Sign): Csc {
        return Factory.buildFactor(`${sign}csc[${contents}]`) as Csc;
    }

    public replaceChild(previousContents: Factor, newContents: Factor): Csc {
        if (this.contents.id === previousContents.id) {
            return Csc.fromFactor(newContents, this.sign);
        }

        return this;
    }

    public override copy(): Csc {
        return Factory.buildFactor(`${this.sign}csc[${this.contents}]`) as Csc;
    }
}