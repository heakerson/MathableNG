import { Equation } from "./math-object/equation.model";
import { Expression } from "./math-object/factor/expression.model";
import { Factor } from "./math-object/factor/factor.model";
import { Variable } from "./math-object/factor/variable.model";
import { Term } from "./math-object/term.model";

export class Factory {
    public static buildFactor(input: string): Factor {
        return new Variable(input);
    }

    public static parseExpressionStrings(input: string): string[] {
        if (input) {
            return this.removeEmptySpace(input).split(/(?:=|<=|>=|<|>)+/);
        }
        return [];
    }

    public static parseTermStrings(input: string): string[] {
        input = this.removeEmptySpace(input);
        const terms: string[] = [];
        let parenthCount = 0;
        let lastTermBreakIndex = -1;
        let lastSign = '+';

        [...input].forEach((c, i) => {
            switch(c) {
                case '(':
                    parenthCount++;
                    break;
                case ')':
                    parenthCount--;
                    break;
                case '+':
                    if (parenthCount === 0) {
                        if (i !== 0) {
                            terms.push(input.substring(lastSign === '-' ? lastTermBreakIndex : lastTermBreakIndex+1, i));
                        }
                        lastTermBreakIndex = i;
                        lastSign = c;
                    }
                    break;
                case '-':
                    if (parenthCount === 0) {
                        if (i !== 0) {
                            terms.push(input.substring(lastSign === '-' ? lastTermBreakIndex : lastTermBreakIndex+1, i));
                        }
                        lastTermBreakIndex = i;
                        lastSign = c;
                    }
                    break;
                default:
                    if (i === input.length - 1) {
                        terms.push(input.substring(lastSign === '-' ? lastTermBreakIndex : lastTermBreakIndex+1));
                    }
                    break;
            }
        })
    

        return terms;
    }

    public static parseFactorStrings(input: string): string[] {
        return [];
    }

    public static removeEmptySpace(input: string): string {
        return input.replace(/\s+/g, '');
    }
}