import { Factor } from "./math-object/factor/factor.model";
import { Variable } from "./math-object/factor/variable.model";

export class StringFormatter {
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
                case '-':
                    const previousCharIsSign = input[i-1] === '+' || input[i-1] === '-';
                    if (parenthCount === 0 && !previousCharIsSign) {
                        if (i !== 0) {
                            terms.push(input.substring(lastTermBreakIndex, i));
                        }
                        lastTermBreakIndex = i;
                        lastSign = c;
                    }
                    break;
                default:
                    if (i === input.length - 1) {
                        terms.push(input.substring(lastTermBreakIndex));
                    }
                    break;
            }
        })
    

        return terms;
    }

    public static parseRationalExpressions(input: string): { numerator: string, denominator: string } {
        return {
            numerator: '',
            denominator: ''
        };
    }

    public static parsePowerFactor(input: string): { base: string, exponent: string } {
        return {
            base: '',
            exponent: ''
        };
    }

    public static parseFactorStrings(input: string): string[] {
        return [];
    } 

    public static removeEmptySpace(input: string): string {
        return input.replace(/\s+/g, '');
    }
}