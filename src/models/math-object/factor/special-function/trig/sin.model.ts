import { TrigTypes } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Sin extends Trig {
    public readonly trigType: TrigTypes = TrigTypes.sin;
    
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}