import { StringFormatter } from "../services/string-formatter.service";
import * as uuid from 'uuid';
import { Type } from "@angular/core";
import { ErrorHandler } from "../services/error-handler.service";

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

        const operatorError = ErrorHandler.tooManyOperators(this.inputWhitespaceRemoved);

        if (operatorError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Malformed Operators: '${operatorError}'`);
        }

        const parenthesisError = ErrorHandler.hasParenthesisCountMismatch(this.inputWhitespaceRemoved);

        if (parenthesisError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Count Mismatch`);
        }

        const bracketCountError = ErrorHandler.hasBracketCountMismatch(this.inputWhitespaceRemoved);

        if (bracketCountError) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Bracket Count Mismatch`);
        }

        const misorderedParenth = ErrorHandler.hasMisorderedClosingParenthesis(this.inputWhitespaceRemoved);

        if (misorderedParenth) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const misorderedBrackets = ErrorHandler.hasMisorderedClosingBrackets(this.inputWhitespaceRemoved);

        if (misorderedBrackets) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Parenthesis Misordered`);
        }

        const hasEmptyParenthesis = ErrorHandler.hasEmptyParenthesis(this.inputWhitespaceRemoved);

        if (hasEmptyParenthesis) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Empty Parenthesis '()'`);
        }

        const hasEmptyBrackets = ErrorHandler.hasEmptyBrackets(this.inputWhitespaceRemoved);

        if (hasEmptyBrackets) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Empty Brackets '[]'`);
        }

        const hasMissingFunctionName = ErrorHandler.hasMissingFunctionName(this.inputWhitespaceRemoved);

        if (hasMissingFunctionName) {
            throw new Error(`${this.constructor.name} Input: ${this.inputWhitespaceRemoved} => Missing Function Name`);
        }
    }

    protected setChildren(): MathObject[] {
        return [];
    }

    protected getFormattedInputString(): string {
        let formatted = this.inputWhitespaceRemoved.replace(')(', ')*(');

        if (formatted[0] === '+') {
            formatted = formatted.substring(1);
        }

        return formatted;
    }
}