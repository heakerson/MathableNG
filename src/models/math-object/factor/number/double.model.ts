import { MathObject } from "src/models/math-object/math-object.model";
import { RealNumber } from "./real-number.model";

export class Double extends RealNumber {
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}