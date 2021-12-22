import { Sign } from "src/models/math-object/enums.model";
import { Double } from "../double.model";

export abstract class Constant extends Double {

    public readonly symbol: string;

    constructor(symbol: string, value: number, sign: Sign) {
        super(`${sign}${value.toString()}`);
        this.symbol = symbol;
    }

    public override toString(): string {
        return `${this.sign}${this.symbol}`;
    }
}