import { TrigTypes } from "src/models/math-object/enums.model";
import { Trig } from "./trig.model";

export class Cos extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.cos;

    public copy(): Cos {
        return Trig.fromFactor<Cos>(this.contents, this.sign, this.trigType);
    }
}