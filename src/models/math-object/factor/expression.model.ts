import { StringFormatter } from "src/models/string-formatter.model";
import { Operators } from "../enums.model";
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

    private _additionalOperators: { termIndex: number, addtionalOperator: Operators }[] = [];

    constructor(input: string) {
        super(input);
    }

    public static fromTerms(terms: Term[]): Expression {
        let innerTerms = '';
        terms.forEach((term) => innerTerms += `${term.toString()}`);

        return new Expression(innerTerms);
    }

    public override toString(): string {
        // let innerTerms = '';
        // this.terms.forEach((term, i) => innerTerms += `${this.getAdditionalOperatorForIndex(i)}${term.toString()}`);
        // return `${this.sign}(${innerTerms})`;
        return this.formattedInput;
    }

    public copy(): Expression {
        return new Expression(this.toString());
    }

    public getAdditionalOperatorForIndex(index: number): Operators {
        const additionalOperator = this._additionalOperators.find(ao => ao.termIndex === index);

        if (additionalOperator) {
            return additionalOperator.addtionalOperator;
        }

        return Operators.None;
    }

    protected override getFormattedInputString(): string {
        const parentFormatted = super.getFormattedInputString();
        
        if (parentFormatted[0] === '-' && StringFormatter.getMatchingParenthesisIndex(parentFormatted, 1) === parentFormatted.length - 1) {
            return parentFormatted;
        }

        return StringFormatter.ensureSurroundingParenthesis(parentFormatted);
    }

    protected override setChildren(): Term[] {
        const removedParenth = StringFormatter.stripSurroundParenthesis(this.formattedInput);
        let parsedTerms = StringFormatter.parseTermStrings(removedParenth);

        parsedTerms = parsedTerms.map((termString, i) => {
            if (termString.length > 2) {
                const prefix = termString.substring(0, 2);

                if (prefix === '--') {
                    this._additionalOperators.push({ termIndex: i, addtionalOperator: Operators.Subtraction});
                    termString = termString.substring(1);
                } else if (prefix === '+-') {
                    this._additionalOperators.push({ termIndex: i, addtionalOperator: Operators.Addition});
                    termString = termString.substring(1);
                }
            }

            return termString;
        });

        return parsedTerms.map(t => new Term(t));
    }
}