import { Double } from "../double.model";

export abstract class Constant extends Double {

    public readonly symbol: string;

    constructor(symbol: string, value: number) {
        super(value.toString());
        this.symbol = symbol;
    }
}