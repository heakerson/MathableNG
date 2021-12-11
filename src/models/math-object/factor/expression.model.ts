import { StringFormatter } from "src/models/string-formatter.model";
import { Term } from "../term.model";
import { Factor } from "./factor.model";

export class Expression extends Factor {

    get terms(): Term[] {
        return this.children as Term[];
    }

    get termCount(): number {
        return this.children.length;
    }

    get isSingleTerm(): boolean {
        return this.termCount === 1;
    }

    constructor(input: string) {
        super(input);
    }

    protected override getFormattedInputString(): string {
        const parentFormatted = super.getFormattedInputString();
        
        if (parentFormatted[0] === '-' && StringFormatter.getMatchingParenthesisIndex(parentFormatted, 1) === parentFormatted.length - 1) {
            return parentFormatted;
        }

        return StringFormatter.ensureSurroundingParenthesis(parentFormatted);
    }

    protected override setChildren(): Term[] {
        return StringFormatter.parseTermStrings(this.formattedInput).map(t => new Term(t));
    }

    copy(): Expression {
        return new Expression(this.formattedInput);
    }
}