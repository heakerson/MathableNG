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
                    if (i === input.length - 1) {
                        terms.push(input.substring(lastTermBreakIndex));
                    }
                    break;
                case '+':
                case '-':
                    const previousCharIsOperator = this.operators.includes(input[i-1]);
                    if (parenthCount === 0 && !previousCharIsOperator) {
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
    
        if (terms.length === 0) {
            terms.push(input);
        }

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
        input = this.removeEmptySpace(input);
        const factors: string[] = [];
        let parenthCount = 0;
        let lastFactorBreakIndex = -1;
        let lastSign = '+';

        [...input].forEach((c, i) => {
            switch(c) {
                case '(':
                    parenthCount++;
                    break;
                case ')':
                    parenthCount--;
                    if (i === input.length - 1) {
                        factors.push(input.substring(lastFactorBreakIndex+1));
                    }
                    break;
                case '*':
                    const previousCharIsOperator = this.operators.includes(input[i-1]);
                    if (parenthCount === 0 && !previousCharIsOperator) {
                        if (i !== 0) {
                            factors.push(input.substring(lastFactorBreakIndex+1, i));
                        }
                        lastFactorBreakIndex = i;
                        lastSign = c;
                    }
                    break;
                default:
                    if (i === input.length - 1) {
                        factors.push(input.substring(lastFactorBreakIndex+1));
                    }
                    break;
            }
        })
    
        if (factors.length === 0) {
            factors.push(input);
        }

        return factors;
    } 

    public static getMatchingParenthesis(input: string, startIndex: number): number {
        return 0;
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