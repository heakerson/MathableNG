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

    protected getFormattedInputString(): string {
        return this.inputWhitespaceRemoved;
    }

    protected checkFormattingErrors(): void {
    }

    toString(): string {
        return this.formattedInput;
    }
}