import { StringFormatter } from "../string-formatter.model";

export abstract class MathObject {
    protected readonly inputWhitespaceRemoved: string;
    protected readonly formattedInput: string;

    abstract clone(): MathObject;

    constructor(protected input: string) {
        this.inputWhitespaceRemoved = StringFormatter.removeEmptySpace(input);
        this.checkFormattingErrors();
        this.formattedInput = this.getFormattedInputString();
    }

    protected checkFormattingErrors(): void {
        if (!this.inputWhitespaceRemoved) {
            throw new Error(`${this.constructor.name} Empty Input`);
        }

        const operatorError = StringFormatter.tooManyOperators(this.inputWhitespaceRemoved);

        if (operatorError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Malformed Operators: '${operatorError}'`);
        }

        const parenthesisError = StringFormatter.hasParenthesisCountMismatch(this.inputWhitespaceRemoved);

        if (parenthesisError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Count Mismatch`);
        }
    }

    protected getFormattedInputString(): string {
        return this.inputWhitespaceRemoved;
    }

    public toString(): string {
        return this.formattedInput;
    }
}