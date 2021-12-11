import { StringFormatter } from "src/models/string-formatter.model";
import { Factor } from "../factor.model";

export abstract class SpecialFunction extends Factor {
    protected readonly functionString: string;

    constructor(input: string) {
        super(input);
        this.functionString = StringFormatter.parseFunctionString(this.formattedInput);
    }
}