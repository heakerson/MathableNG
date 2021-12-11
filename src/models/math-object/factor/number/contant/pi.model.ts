import { MathObject } from "src/models/math-object/math-object.model";
import { Constant } from "./constant.model";

export class PI extends Constant {

    override get value(): number {
        return Math.PI;
    }

    constructor() {
        super(Math.PI.toString());
    }

    override copy(): MathObject {
        throw new Error("Method not implemented.");
    }
}