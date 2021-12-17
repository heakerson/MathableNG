import { StringFormatter } from "../string-formatter.model";
import * as uuid from 'uuid';
import { Type } from "@angular/core";

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

    public travsere<TMathObject extends MathObject>(type: Type<TMathObject>, fn: (mo: TMathObject) => void): void {
        if (this instanceof type) {
            fn(this as any);
        }

        this.children.forEach(c => {
            c.travsere(type, fn);
        });
    }

    public find<TMathObject extends MathObject>(type: Type<TMathObject>, fn: (mo: TMathObject) => boolean): TMathObject {
        let found = false;
        if (this instanceof type) {
            found = fn(this as any);

            if (found) {
                return this;
            }
        }

        let foundChild: any;
        this.children.forEach(c => {
            if (!foundChild) {
                foundChild = c.find<TMathObject>(type, fn);
            }
        });

        return foundChild;
    }

    protected getChild<TChild extends MathObject>(childIndex: number): TChild {
        return this.children[childIndex] as TChild;
    }

    protected insertChildren<TChild extends MathObject>(index: number, ...newChildren: MathObject[]): TChild[] {
        return [
            ...this.children.slice(0, index),
            ...newChildren,
            ...this.children.slice(index)
        ] as TChild[];
    }

    protected appendChildren<TChild extends MathObject>(...newChildren: MathObject[]): TChild[] {
        return [
            ...this.children,
            ...newChildren,
        ] as TChild[];
    }

    protected prependChildren<TChild extends MathObject>(...newChildren: MathObject[]): TChild[] {
        return [
            ...newChildren,
            ...this.children,
        ] as TChild[];
    }

    protected removeChildrenById<TChild extends MathObject>(...idsToRemove: uuid.V1Options[]): TChild[] {
        return this.children.filter(c => !idsToRemove.includes(c.id)) as TChild[];
    }

    protected removeChildrenByIndex<TChild extends MathObject>(...indicesToRemove: number[]): TChild[] {
        return this.children.filter((c, i) => !indicesToRemove.includes(i)) as TChild[];
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

        const bracketCountError = StringFormatter.hasBracketCountMismatch(this.inputWhitespaceRemoved);

        if (bracketCountError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Bracket Count Mismatch`);
        }

        const misorderedParenth = StringFormatter.hasMisorderedClosingParenthesis(this.inputWhitespaceRemoved);

        if (misorderedParenth) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const misorderedBrackets = StringFormatter.hasMisorderedClosingBrackets(this.inputWhitespaceRemoved);

        if (misorderedBrackets) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const hasEmptyParenthesis = StringFormatter.hasEmptyParenthesis(this.inputWhitespaceRemoved);

        if (hasEmptyParenthesis) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Empty Parenthesis '()'`);
        }

        const hasEmptyBrackets = StringFormatter.hasEmptyBrackets(this.inputWhitespaceRemoved);

        if (hasEmptyBrackets) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Empty Brackets '[]'`);
        }
    }

    protected setChildren(): MathObject[] {
        return [];
    }

    protected getFormattedInputString(): string {
        return this.inputWhitespaceRemoved.replace(')(', ')*(');
    }
}