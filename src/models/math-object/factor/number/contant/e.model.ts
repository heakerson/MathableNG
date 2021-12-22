import { Constants, Sign } from "src/models/math-object/enums.model";
import { Constant } from "./constant.model";

export class E extends Constant {
    constructor(sign: Sign) {
        super(Constants.E, Math.E, sign);
    }

    public override copy(): E {
        return new E(this.sign);
    }
}