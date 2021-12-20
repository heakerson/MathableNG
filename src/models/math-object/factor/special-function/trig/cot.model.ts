import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Cot extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.cot;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'cot');
    }

    public copy(): Cot {
        return Trig.fromFactor<Cot>(this.contents, this.sign, this.trigType);
    }
}