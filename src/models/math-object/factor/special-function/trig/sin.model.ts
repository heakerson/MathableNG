import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Sin extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.sin;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'sin');
    }
    
    public copy(): Sin {
        return Trig.fromFactor<Sin>(this.contents, this.sign, this.trigType);
    }
}