import { Factor } from "./math-object/factor/factor.model";
import { Variable } from "./math-object/factor/variable.model";

export class StringFormatter {
    private static operators = ['+', '-', '/', '*', '^'];
    private static nonSignOperators = ['/', '*', '^'];

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

    public static hasParenthesisCountMismatch(input: string): boolean {
        let count = 0;

        [...input].forEach((c) => {
            switch (c) {
                case '(':
                    count++;
                    break;
                case ')':
                    count--;
                    break;
            }
        });

        return count !== 0;
    }

    public static hasMisorderedClosingParenthesis(input: string): boolean {
        let openCount = 0;
        let closeCount = 0;
        let errorFound = false;

        [...input].forEach((c) => {
            if (!errorFound) {
                switch (c) {
                    case '(':
                        openCount++;
                        break;
                    case ')':
                        closeCount++;
                        if (closeCount > openCount) {
                            errorFound = true;
                        }
                        break;
                }
            }
        });

        return errorFound;
    }

    public static hasEmptyParenthesis(input: string): boolean {
        return this.removeEmptySpace(input).indexOf('()') > -1;
    }

    public static tooManyOperators(input: string): string | null {
        let operatorString: string = '';
        let foundError = false;
        const exceptions = this.operators.map(o => `${o}-`);

        [...input].forEach((c, i) => {
            if (!foundError) {
                if (this.operators.includes(c)) {
                    operatorString+=c;
                } else {
                    if (operatorString && !exceptions.includes(operatorString) && operatorString.length > 1) {
                        foundError = true;
                    } else {
                        operatorString = '';
                    }
                }
            }
        });

        return foundError ? operatorString : null;
    }

    public static hasMisplacedOperators(input: string): string | null {
        let operatorError: string = '';
        let foundError = false;
        const leftErrors = this.nonSignOperators.map(o => `(${o}`);
        const rightErrors = this.operators.map(o => `${o})`);
        const inputArray = [...input];

        inputArray.forEach((c, i) => {
            if (!foundError) {
                switch (c) {
                    case '(':
                        if (input.length - 1 > i) {
                            const subStr = input.substring(i, i+2);
                            if (leftErrors.includes(subStr)) {
                                operatorError = subStr;
                                foundError = true;
                            }
                        }
                        break;
                    case ')':
                        const subStr = input.substring(i-1, i+1);
                        if (rightErrors.includes(subStr)) {
                            operatorError = subStr;
                            foundError = true;
                        }
                        break;
                }
            }
        });

        return foundError ? operatorError : null;
    }
}