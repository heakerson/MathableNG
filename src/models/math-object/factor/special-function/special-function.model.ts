import { Factor } from "../factor.model";

export abstract class SpecialFunction extends Factor {
    abstract readonly functionString: string;

    constructor(expressionString: string) {
        super(expressionString);
    }
}