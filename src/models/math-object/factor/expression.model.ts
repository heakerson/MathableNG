import { StringFormatter } from "src/models/string-formatter.model";
import { Term } from "../term.model";
import { Factor } from "./factor.model";

export class Expression extends Factor {

    public readonly terms: Term[];

    constructor(input: string) {
        super(input);
        this.terms = StringFormatter.parseTermStrings(this.formattedInput).map(t => new Term(t));
    }

    clone(): Expression {
        return new Expression(this.formattedInput);
    }
}