import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Sec extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'sec');
    }
    
    public static fromFactor(contents: Factor, sign: Sign): Sec {
        return Factory.buildFactor(`${sign}sec[${contents}]`) as Sec;
    }

    public replaceChild(previousContents: Factor, newContents: Factor): Sec {
        if (this.contents.id === previousContents.id) {
            return Sec.fromFactor(newContents, this.sign);
        }

        return this;
    }

    public override copy(): Sec {
        return Factory.buildFactor(`${this.sign}sec[${this.contents}]`) as Sec;
    }
}