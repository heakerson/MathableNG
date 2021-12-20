import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Csc extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.csc;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'csc');
    }

    public copy(): Csc {
        return Trig.fromFactor<Csc>(this.contents, this.sign, this.trigType);
    }
}