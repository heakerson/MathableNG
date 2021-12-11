import { Constant } from "./constant.model";

export class E extends Constant {
    override get value(): number {
        return Math.E;
    }

    constructor() {
        super(Math.E.toString());
    }
}