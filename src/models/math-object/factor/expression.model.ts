import { StringFormatter } from "src/models/string-formatter.model";
import { MathObject } from "../math-object.model";
import { Term } from "../term.model";

export class Expression extends MathObject {

    public readonly terms: Term[];

    constructor(input: string) {
        super(input);
        this.terms = StringFormatter.parseTermStrings(this.formattedInput).map(t => new Term(t));
    }

    clone(): Expression {
        return new Expression(this.formattedInput);
    }
}