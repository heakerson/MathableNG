import { StringFormatter } from "../string-formatter.model";
import * as uuid from 'uuid';

export abstract class MathObject {
    public readonly id: any;
    public readonly children: MathObject[];

    protected readonly inputWhitespaceRemoved: string;
    protected readonly formattedInput: string;

    abstract copy(): MathObject;

    constructor(protected input: string) {
        this.id = uuid.v1();
        this.inputWhitespaceRemoved = StringFormatter.removeEmptySpace(input);
        this.checkFormattingErrors();
        this.formattedInput = this.getFormattedInputString();
        this.children = this.setChildren();
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

    protected setChildren(): MathObject[] {
        return [];
    }

    protected getFormattedInputString(): string {
        return this.inputWhitespaceRemoved.replace(')(', ')*(');
    }

    public toString(): string {
        return this.formattedInput;
    }
}