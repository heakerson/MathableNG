import { Factor } from "../../factor.model";
import { Function } from "../function.model";

export abstract class Trig extends Function {

    get contents(): Factor {
        return this.children[0] as Factor;
    }

}