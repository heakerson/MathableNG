import { StringFormatter } from "./string-formatter.service";

export class ErrorHandler {

    public static checkBaseChildErrors(inputWhitespaceRemoved: string, objectName: string): void {
        const operatorError = this.tooManyOperators(inputWhitespaceRemoved);

        if (operatorError) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Malformed Operators: '${operatorError}'`);
        }

        const parenthesisError = this.hasParenthesisCountMismatch(inputWhitespaceRemoved);

        if (parenthesisError) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Parenthesis Count Mismatch`);
        }

        const bracketCountError = this.hasBracketCountMismatch(inputWhitespaceRemoved);

        if (bracketCountError) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Bracket Count Mismatch`);
        }

        const misorderedParenth = this.hasMisorderedClosingParenthesis(inputWhitespaceRemoved);

        if (misorderedParenth) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const misorderedBrackets = this.hasMisorderedClosingBrackets(inputWhitespaceRemoved);

        if (misorderedBrackets) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const hasEmptyParenthesis = this.hasEmptyParenthesis(inputWhitespaceRemoved);

        if (hasEmptyParenthesis) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Empty Parenthesis '()'`);
        }

        const hasEmptyBrackets = this.hasEmptyBrackets(inputWhitespaceRemoved);

        if (hasEmptyBrackets) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Empty Brackets '[]'`);
        }

        const hasMissingFunctionName = this.hasMissingFunctionName(inputWhitespaceRemoved);

        if (hasMissingFunctionName) {
            throw new Error(`${objectName} Input: ${inputWhitespaceRemoved} => Missing Function Name`);
        }
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
        return StringFormatter.removeEmptySpace(input).indexOf('()') > -1;
    }

    public static hasEmptyBrackets(input: string): boolean {
        return StringFormatter.removeEmptySpace(input).indexOf('[]') > -1;
    }

    public static hasMissingFunctionName(input: string): boolean {
        input = StringFormatter.removeEmptySpace(input);
        const breakPoints = [...StringFormatter.operators, '(', ')', '[', ']'];
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

                isMissingFunctionName = !StringFormatter.getFnString(prefix);
            }
        });

        return isMissingFunctionName;
    }

    public static tooManyOperators(input: string): string | null {
        let operatorString: string = '';
        let foundError = false;
        const exceptions = StringFormatter.operators.map(o => `${o}-`);

        [...input].forEach((c, i) => {
            if (!foundError) {
                if (StringFormatter.operators.includes(c)) {
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
        const leftErrors = [...StringFormatter.nonSignOperators.map(o => `(${o}`), ...StringFormatter.nonSignOperators.map(o => `[${o}`)];
        const rightErrors = [...StringFormatter.operators.map(o => `${o})`), ...StringFormatter.operators.map(o => `${o}]`)];
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