import { MathObject } from "src/models/math-object/math-object.model";
import { Number } from "./number.model";

export class Integer extends Number {
    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}