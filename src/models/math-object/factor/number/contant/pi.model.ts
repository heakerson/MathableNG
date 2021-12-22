import { Constants } from "src/models/math-object/enums.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Constant } from "./constant.model";

export class PI extends Constant {
    constructor() {
        super(Constants.PI, Math.PI);
    }

    public override copy(): PI {
        return new PI();
    }
}