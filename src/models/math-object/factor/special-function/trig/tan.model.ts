import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Tan extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.tan;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'tan');
    }

    public copy(): Tan {
        return Trig.fromFactor<Tan>(this.contents, this.sign, this.trigType);
    }
}