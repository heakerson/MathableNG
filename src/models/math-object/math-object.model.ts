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

    public find<TMathObject extends MathObject>(type: any, predicateFn: (mo: TMathObject, ctx: Context) => boolean = () => true, childFirst: boolean = false): Context | null {
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

    public findChild<TMathObject extends MathObject>(type: any, predicateFn: (mo: TMathObject) => boolean = () => true): TMathObject | null {
        let child: TMathObject | null = null;
        const children = this.getTraversableChildren();

        children.forEach(c => {
            if (!child) {
                if (c instanceof type) {
                    const predicatePasses = predicateFn(c as TMathObject);
    
                    if (predicatePasses) {
                        child = c as TMathObject;
                    }
                }
            }
        });

        return child;
    }

    public replace<TReplacementType extends MathObject>(previousMathObject: TReplacementType, newMathObject: TReplacementType): this {
        let childCtx = this.find(MathObject, (mo) => mo.id === previousMathObject.id);
        let newObject = newMathObject;

        if (childCtx) {
            let parentCtx = childCtx.parentContext;
    
            while (parentCtx) {
                const parent: MathObject = parentCtx.target;
                newObject = parent.replaceChild(newObject, childCtx.target) as any;

                childCtx = parentCtx;
                parentCtx = parentCtx.parentContext;
            }

            return newObject as any;
        }

        return this;
    }

    public toString(): string {
        return this.formattedInput;
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
    
    protected getTraversableChildren(): MathObject[] {
        return this.children;
    }
}