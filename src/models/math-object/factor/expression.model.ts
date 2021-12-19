import { StringFormatter } from "src/models/services/string-formatter.service";
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

    protected additionalOperators: { termIndex: number, addtionalOperator: Operators }[] = [];

    constructor(input: string) {
        super(input);
        this.additionalOperators = this.setAdditionalOperators();
    }

    public static fromTerms(...terms: Term[]): Expression {
        let innerTerms = '';
        terms.forEach((term, i) => {
            const sign = !term.isNegative ? (i === 0 ? '' : '+') : '';
            return innerTerms += `${sign}${term.toString()}`;
        });

        return new Expression(innerTerms);
    }

    public getTerm(index: number): Term {
        return this.getChild<Term>(index);
    }

    public appendTerms(...terms: Term[]): Expression {
        const newChildren = this.appendChildren<Term>(...terms);
        return Expression.fromTerms(...newChildren);
    }

    public prependTerms(...terms: Term[]): Expression {
        const newChildren = this.prependChildren<Term>(...terms);
        return Expression.fromTerms(...newChildren);
    }

    public insertTerms(index: number, ...terms: Term[]): Expression {
        const newChildren = this.insertChildren<Term>(index, ...terms);
        return Expression.fromTerms(...newChildren);
    }

    public removeTerms(...terms: Term[]): Expression {
        const newChildren = this.removeChildrenById<Term>(...terms.map(f => f.id));
        return Expression.fromTerms(...newChildren);
    }

    public removeTermsAtIndices(...indices: number[]): Expression {
        const newChildren = this.removeChildrenByIndex<Term>(...indices);
        return Expression.fromTerms(...newChildren);
    }

    public override toString(): string {
        let innerTerms = '';
        this.terms.forEach((term, i) => {
            let termSign = '';

            if (term.isNegative) {
                if (i !== 0 && term.toString()[0] !== '-') {
                    termSign = '-';
                }
            } else if(i !== 0) {
                termSign = '+';
            }

            innerTerms += `${this.getAdditionalOperatorForIndex(i)}${termSign}${term.toString()}`;
        });

        return `${this.sign}(${innerTerms})`;
    }

    public copy(): Expression {
        return new Expression(this.toString());
    }

    protected getAdditionalOperatorForIndex(index: number): Operators {
        const additionalOperator = this.additionalOperators.find(ao => ao.termIndex === index);

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
        const removedParenth = StringFormatter.stripSurroundingParenthesis(this.formattedInput);
        let parsedTerms = StringFormatter.parseTermStrings(removedParenth);
        this.additionalOperators = [];

        parsedTerms = parsedTerms.map((termString, i) => {
            if (termString.length > 2) {
                const prefix = termString.substring(0, 2);

                if (prefix === '--' || prefix === '+-') {
                    termString = termString.substring(1);
                }
            }

            return termString;
        });

        return parsedTerms.map(t => new Term(t));
    }

    protected setAdditionalOperators(): { termIndex: number, addtionalOperator: Operators }[] {
        const removedParenth = StringFormatter.stripSurroundingParenthesis(this.formattedInput);
        let parsedTerms = StringFormatter.parseTermStrings(removedParenth);
        let additionalOps: { termIndex: number, addtionalOperator: Operators }[] = [];

        parsedTerms.forEach((termString, i) => {
            if (termString.length > 2) {
                const prefix = termString.substring(0, 2);

                if (prefix === '--') {
                    additionalOps.push({ termIndex: i, addtionalOperator: Operators.Subtraction});
                } else if (prefix === '+-') {
                    additionalOps.push({ termIndex: i, addtionalOperator: Operators.Addition});
                }
            }
        });

        return additionalOps;
    }
}
