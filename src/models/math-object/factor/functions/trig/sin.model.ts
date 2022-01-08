import { Sign } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/core/factory.service";
import { Factor } from "../../factor.model";
import { Trig } from "./trig.model";

export class Sin extends Trig {

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'sin');
    }
    
    public static fromFactor(contents: Factor, sign: Sign): Sin {
        return Factory.buildFactor(`${sign}sin[${contents}]`) as Sin;
    }

    public replaceChild(previousContents: Factor, newContents: Factor): Sin {
        if (this.contents.id === previousContents.id) {
            return Sin.fromFactor(newContents, this.sign);
        }

        return this;
    }

    public override copy(): Sin {
        return Factory.buildFactor(`${this.sign}sin[${this.contents}]`) as Sin;
    }
}