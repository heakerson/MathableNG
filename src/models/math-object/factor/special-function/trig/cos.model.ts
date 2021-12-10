import { MathObject } from "src/models/math-object/math-object.model";
import { Trig } from "./trig.model";

export class Cos extends Trig {
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}