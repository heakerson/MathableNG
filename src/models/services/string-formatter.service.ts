import { Constants, LogTypes, TrigTypes } from "../math-object/enums.model";
export class StringFormatter {
    private static operators = ['+', '-', '/', '*', '^'];
    private static nonSignOperators = ['/', '*', '^'];

    public static getFnString(input: string): string {
        const fns: string[] = [...Object.keys(TrigTypes), ...Object.keys(LogTypes)];
        const found = fns.find(fn => input.toLocaleLowerCase().startsWith(fn));

        if (found) {
            return found;
        }

        return '';
    }

    public static getConstantString(input: string): string {
        const constants: string[] = [...Object.keys(Constants)];
        const found = constants.find(constant => input.toUpperCase() === constant);

        if (found) {
            return found;
        }

        return '';
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

    public static parseRationalExpressions(factorString: string): { numerator: string, denominator: string } {
        factorString = this.stripSurroundingParenthesis(factorString);
        const isSingleFactor = this.parseFactorStrings(factorString).length === 1;
        const isSingleTerm = this.parseTermStrings(factorString).length === 1;
        let num = '';
        let denom = '';

        if (isSingleFactor && isSingleTerm) {
            let bracketCt = 0;
            let parenthCt = 0;
            let found = false;
    
            [...factorString].forEach((c, i) => {
                if (!found) {
                    switch(c) {
                        case '[':
                            bracketCt++;
                            break;
                        case ']':
                            bracketCt--;
                            break;
                        case '(':
                            parenthCt++;
                            break;
                        case ')':
                            parenthCt--;
                            break;
                        case '/':
                            if (bracketCt === 0 && parenthCt === 0) {
                                const tempNum = factorString.substring(0, i);
                                const tempDenom = factorString.substring(i+1);
    
                                // preventing inputs like (a+b/c) => a+b/c => a+b & c
                                if (this.parseTermStrings(tempNum).length === 1 && this.parseTermStrings(tempDenom).length === 1) {
                                    num = tempNum;
                                    denom = tempDenom;
                                    found = true;
                                }
                            }
                            break;
                    }
                }
            })
        }

        return {
            numerator: num,
            denominator: denom
        };
    }

    public static parsePowerFactor(factorString: string): { base: string, exponent: string } {
        const isSingleFactor = this.parseFactorStrings(factorString).length === 1;
        const isSingleTerm = this.parseTermStrings(factorString).length === 1;
        const isRational = isSingleFactor && isSingleTerm
            && this.parseRationalExpressions(factorString).denominator !== '' 
            && this.parseRationalExpressions(factorString).numerator !== '';

        let base = '';
        let exponent = '';

        if (isSingleFactor && isSingleTerm && !isRational) {
            let bracketCt = 0;
            let parenthCt = 0;
            let found = false;
    
            [...factorString].forEach((c, i) => {
                if (!found) {
                    switch(c) {
                        case '[':
                            bracketCt++;
                            break;
                        case ']':
                            bracketCt--;
                            break;
                        case '(':
                            parenthCt++;
                            break;
                        case ')':
                            parenthCt--;
                            break;
                        case '^':
                            if (bracketCt === 0 && parenthCt === 0) {
                                base = factorString.substring(0, i);
                                exponent = factorString.substring(i+1);
                                found = true;
                            }
                            break;
                    }
                }
            })
        }

        return {
            base,
            exponent
        };
    }

    public static parseFactorStrings(input: string): string[] {
        input = this.removeEmptySpace(input);
        const factors: string[] = [];
        let parenthCount = 0;
        let bracketCount = 0;
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
                case '[':
                    bracketCount++;
                    break;
                case ']':
                    bracketCount--;
                    if (i === input.length - 1) {
                        factors.push(input.substring(lastFactorBreakIndex+1));
                    }
                    break;
                case '*':
                    const previousCharIsOperator = this.operators.includes(input[i-1]);
                    if (parenthCount === 0 && bracketCount === 0 && !previousCharIsOperator) {
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

    public static getMatchingParenthesisIndex(input: string, parenthIndex: number): number {
        const startParenth = input[parenthIndex];
        const direction = startParenth === '(' ? 1 : (startParenth === ')' ? -1 : 0);
        const startIndex = parenthIndex += direction;
        let count = 0;

        if (direction) {
            for (let i = startIndex; i < input.length && i > -1; i+=direction) {
                const char = input[i];
    
                switch (char) {
                    case '(':
                        if (count === 0 && direction < 0) {
                            return i;
                        }
                        if (direction < 0) {
                            count--;
                        } else {
                            count++;
                        }
                        break;
                    case ')':
                        if (count === 0 && direction > 0) {
                            return i;
                        }
                        if (direction < 0) {
                            count++;
                        } else {
                            count--;
                        }
                        break;
                }
            }
        }


        return -1;
    }

    public static getMatchingBracketIndex(input: string, bracket: number): number {
        const startBracket = input[bracket];
        const direction = startBracket === '[' ? 1 : (startBracket === ']' ? -1 : 0);
        const startIndex = bracket += direction;
        let count = 0;

        if (direction) {
            for (let i = startIndex; i < input.length && i > -1; i+=direction) {
                const char = input[i];
    
                switch (char) {
                    case '[':
                        if (count === 0 && direction < 0) {
                            return i;
                        }
                        if (direction < 0) {
                            count--;
                        } else {
                            count++;
                        }
                        break;
                    case ']':
                        if (count === 0 && direction > 0) {
                            return i;
                        }
                        if (direction < 0) {
                            count++;
                        } else {
                            count--;
                        }
                        break;
                }
            }
        }


        return -1;
    }

    public static ensureSurroundingParenthesis(input: string): string {
        if (input[0] === '(') {
            const matchingIndex = this.getMatchingParenthesisIndex(input, 0);
            if (matchingIndex === input.length - 1) {
                return input;
            }
        }

        return `(${input})`;
    }

    public static stripSurroundingParenthesis(input: string): string {
        if (input[0] === '(') {
            const matchingIndex = this.getMatchingParenthesisIndex(input, 0);
            if (matchingIndex === input.length - 1) {
                return input.substring(1, input.length - 1);
            }
        } else if (input[0] === '-' && input[1] === '(') {
            const matchingIndex = this.getMatchingParenthesisIndex(input, 1);
            if (matchingIndex === input.length - 1) {
                return input.substring(2, input.length - 1);
            }
        }

        return input;
    }

    public static getFunctionContents(functionFactor: string): string[] {
        if (functionFactor[0] === '-') {
            functionFactor = functionFactor.substring(1);
        }

        const fnString = this.getFnString(functionFactor);
        functionFactor = functionFactor.substring(fnString.length);

        if (functionFactor[0] === '[') {
            const matchingIndex = this.getMatchingBracketIndex(functionFactor, 0);
            if (matchingIndex === functionFactor.length - 1) {
                const content = functionFactor.substring(1, functionFactor.length - 1);
                return content.split(',');
            }
        } else if (functionFactor[0] === '-' && functionFactor[1] === '[') {
            const matchingIndex = this.getMatchingBracketIndex(functionFactor, 1);
            if (matchingIndex === functionFactor.length - 1) {
                const content = functionFactor.substring(2, functionFactor.length - 1);
                return content.split(',');
            }
        }
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

    public static hasBracketCountMismatch(input: string): boolean {
        let count = 0;

        [...input].forEach((c) => {
            switch (c) {
                case '[':
                    count++;
                    break;
                case ']':
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

    public static hasMisorderedClosingBrackets(input: string): boolean {
        let openCount = 0;
        let closeCount = 0;
        let errorFound = false;

        [...input].forEach((c) => {
            if (!errorFound) {
                switch (c) {
                    case '[':
                        openCount++;
                        break;
                    case ']':
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

    public static hasEmptyBrackets(input: string): boolean {
        return this.removeEmptySpace(input).indexOf('[]') > -1;
    }

    public static hasMissingFunctionName(input: string): boolean {
        input = this.removeEmptySpace(input);
        const breakPoints = [...this.operators, '(', ')', '[', ']'];
        let isMissingFunctionName = false;

        [...input].forEach((c, i) => {
            if (c === '[' && !isMissingFunctionName) {
                const beforeChar = [...input.slice(0, i)].reverse();
                const nextOperatorIndex = beforeChar.findIndex(ch => breakPoints.includes(ch));
                let prefix;
                
                if (nextOperatorIndex === -1) {
                    prefix = input.substring(0, i);
                } else {
                    prefix = input.substring(i - nextOperatorIndex, i);
                }

                isMissingFunctionName = !this.getFnString(prefix);
            }
        });

        return isMissingFunctionName;
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
        const leftErrors = [...this.nonSignOperators.map(o => `(${o}`), ...this.nonSignOperators.map(o => `[${o}`)];
        const rightErrors = [...this.operators.map(o => `${o})`), ...this.operators.map(o => `${o}]`)];
        const inputArray = [...input];

        inputArray.forEach((c, i) => {
            if (!foundError) {
                switch (c) {
                    case '(':
                    case '[':
                        if (input.length - 1 > i) {
                            const subStr = input.substring(i, i+2);
                            if (leftErrors.includes(subStr)) {
                                operatorError = subStr;
                                foundError = true;
                            }
                        }
                        break;
                    case ')':
                    case ']':
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