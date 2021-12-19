import { Constants } from "src/models/math-object/enums.model";
import { Constant } from "./constant.model";

export class E extends Constant {
    constructor() {
        super(Constants.E, Math.E);
    }
}