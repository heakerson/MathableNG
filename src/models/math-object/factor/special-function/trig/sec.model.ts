import { Sign, TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Sec extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.sec;

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'sec');
    }
    
    public copy(): Sec {
        return Trig.fromFactor<Sec>(this.contents, this.sign, this.trigType);
    }
}