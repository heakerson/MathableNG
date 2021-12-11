import { MathObject } from "src/models/math-object/math-object.model";
import { RealNumber } from "./real-number.model";

export class Integer extends RealNumber {

    get isEven() : boolean {
        return this.value % 2 === 0;
    }

    copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}