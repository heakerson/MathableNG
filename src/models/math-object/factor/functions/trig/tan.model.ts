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

    public replaceChild(previousContents: Factor, newContents: Factor): Tan {
        if (this.contents.id === previousContents.id) {
            return Tan.fromFactor(newContents, this.sign);
        }

        return this;
    }

    public override copy(): Tan {
        return Factory.buildFactor(`${this.sign}tan[${this.contents}]`) as Tan;
    }
}