import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Factory } from "src/models/services/factory.service";
import { Factor } from "../../factor.model";
import { Function } from "../function.model";

export abstract class Trig extends Function {

    get contents(): Factor {
        return this.getChild<Factor>(0);
    }

    abstract readonly trigType: TrigTypes;

    public abstract override copy(): Trig;

    public static fromFactor<TTrig extends Trig>(contents: Factor, sign: Sign, trigType: TrigTypes): TTrig {
        return Factory.buildFactor(`${sign}${trigType}[${contents}]`) as TTrig;
    }

}