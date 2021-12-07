import { Factory } from "../factory.model";

export abstract class MathObject {
    protected readonly inputWhitespaceRemoved: string;
    abstract toString(): string;
    abstract clone(): MathObject;

    constructor(protected input: string) {
        this.inputWhitespaceRemoved = Factory.removeEmptySpace(input);
    }
}