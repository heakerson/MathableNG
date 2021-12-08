import { StringFormatter } from "../factory.model";

export abstract class MathObject {
    protected readonly inputWhitespaceRemoved: string;
    protected readonly formattedInput: string;

    abstract clone(): MathObject;

    constructor(protected input: string) {
        this.inputWhitespaceRemoved = StringFormatter.removeEmptySpace(input);
        this.formattedInput = this.getFormattedInputString();
    }

    protected getFormattedInputString(): string {
        return this.inputWhitespaceRemoved;
    }

    toString(): string {
        return this.formattedInput;
    }
}