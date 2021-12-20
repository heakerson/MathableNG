import { Sign } from "src/models/math-object/enums.model";
import { E } from "../../number/contant/e.model";
import { Log } from "./log.model";

export class Ln extends Log {

    public override get base(): E {
        return this.children[1] as E;
    }

    constructor(contentStr: string, sign: Sign) {
        super(contentStr, sign, 'E');
    }
}