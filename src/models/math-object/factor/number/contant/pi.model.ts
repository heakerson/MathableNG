import { Constants, Sign } from "src/models/math-object/enums.model";
import { Constant } from "./constant.model";

export class PI extends Constant {
    constructor(sign: Sign) {
        super(Constants.PI, Math.PI, sign);
    }

    public override copy(): PI {
        return new PI(this.sign);
    }
}