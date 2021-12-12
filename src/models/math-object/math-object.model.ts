import { StringFormatter } from "../string-formatter.model";
import * as uuid from 'uuid';

export abstract class MathObject {
    public readonly id: any;
    public readonly children: MathObject[];

    public abstract copy(): MathObject;

    protected readonly inputWhitespaceRemoved: string;
    protected readonly formattedInput: string;

    constructor(protected input: string) {
        this.id = uuid.v1();
        this.inputWhitespaceRemoved = StringFormatter.removeEmptySpace(input);
        this.checkFormattingErrors();
        this.formattedInput = this.getFormattedInputString();
        this.children = this.setChildren();
    }

    public toString(): string {
        return this.formattedInput;
    }

    protected getChild(childIndex: number): MathObject {
        return this.children[childIndex];
    }

    protected insertChildren(index: number, ...newChildren: MathObject[]): MathObject[] {
        return [
            ...this.children.slice(0, index),
            ...newChildren,
            ...this.children.slice(index)
        ];
    }

    protected appendChildren(...newChildren: MathObject[]): MathObject[] {
        return [
            ...this.children,
            ...newChildren,
        ];
    }

    protected preChildren(...newChildren: MathObject[]): MathObject[] {
        return [
            ...newChildren,
            ...this.children,
        ];
    }

    protected removeChildrenById(...idsToRemove: uuid.V1Options[]): MathObject[] {
        return this.children.filter(c => !idsToRemove.includes(c.id));
    }

    protected removeChildrenByIndex(...indicesToRemove: number[]): MathObject[] {
        return this.children.filter((c, i) => !indicesToRemove.includes(i));
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
}