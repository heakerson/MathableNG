import { StringFormatter } from "../services/string-formatter.service";
import * as uuid from 'uuid';
import { Context } from "../search/context.model";
import { Position } from "../search/position.model";

export abstract class MathObject {
    public readonly id: any;
    public readonly children: MathObject[];

    public abstract copy(): MathObject;
    public abstract replaceChild(newMathObject: MathObject, previousMathObject: MathObject): MathObject;

    protected readonly inputWhitespaceRemoved: string;
    protected readonly formattedInput: string;

    public get toStringGet(): string {
        return this.toString();
    }

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

    public traverse<TMathObject extends MathObject>(type: any, fn: (mo: TMathObject, ctx: Context) => void, childFirst: boolean = false): void {
        const rootContext = new Context(this, new Position(0, 0));
        const traversableChildren = this.getTraversableChildren();

        if (childFirst) {
            traversableChildren.forEach((c, i) => {
                c.traverseInternal(type, rootContext, i, fn, childFirst);
            });

            if (this instanceof type) {
                fn(this as any, rootContext);
            }
        } else {
            if (this instanceof type) {
                fn(this as any, rootContext);
            }
    
            traversableChildren.forEach((c, i) => {
                c.traverseInternal(type, rootContext, i, fn, childFirst);
            });
        }
    }

    protected getTraversableChildren(): MathObject[] {
        return this.children;
    }

    private traverseInternal<TMathObject extends MathObject>(type: any, parentCtx: Context, index: number, fn: (mo: TMathObject, ctx: Context) => void, childFirst: boolean = false): void {
        const context = new Context(this, new Position(parentCtx.position.level + 1, index), parentCtx);

        if (childFirst) {
            this.children.forEach((c, i) => {
                c.traverseInternal(type, context, i, fn, childFirst);
            });

            if (this instanceof type) {
                fn(this as any, context);
            }
        } else {
            if (this instanceof type) {
                fn(this as any, context);
            }
    
            this.children.forEach((c, i) => {
                c.traverseInternal(type, context, i, fn, childFirst);
            });
        }
    }

    public find<TMathObject extends MathObject>(type: typeof MathObject, predicateFn: (mo: TMathObject, ctx: Context) => boolean = () => true, childFirst: boolean = false): Context | null {
        let foundContext = null;
        let continueSearch = true;

        this.traverse<TMathObject>(type, (mo, ctx) => {
            if (continueSearch) {
                const success = predicateFn(mo, ctx);

                if (success) {
                    foundContext = ctx;
                    continueSearch = false;
                }
            }
        }, childFirst);

        return foundContext;
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

        this.checkCustomFormattingErrors();
    }

    protected checkCustomFormattingErrors(): void { }

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