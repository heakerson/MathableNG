import { Sign } from "../../enums.model";
import { Factor } from "../factor.model";

export abstract class SpecialFunction extends Factor {
    abstract readonly functionString: string;
    protected readonly fnSign: Sign;

    constructor(expressionString: string, sign: Sign,) {
        super(expressionString);
        this.fnSign = sign;
    }
}