import { MathObject } from "src/models/math-object/math-object.model";
import { Context } from "src/models/search/context.model";
import { ErrorCodes } from "src/models/services/core/error-handler.service";
import * as uuid from 'uuid';

export function mathObjectConstructorTests<TMathObject extends MathObject, TTest extends MathObjectConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TMathObject
): void {

    describe(`MathObject Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TMathObject = builder(test);
                // console.log(test);
                // console.log(mo);
                // console.log('toString', mo.toString());
                expect(uuid.validate(mo.id)).toBeTrue();
                expect(mo.children.map(c => c.toString())).toEqual(test.children);
                expect(mo.toString()).toEqual(test.toString);
                expect(mo.copy().toString()).toEqual(mo.toString());
            });
        });
    });
}

export const baseMathObjectErrorTests: { input: string, errorCode: number}[] = [
    { input: '', errorCode: ErrorCodes.EMPTY },
    { input: '     ', errorCode: ErrorCodes.EMPTY },
    { input: 'a**b', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: 'x*(a/*b)', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: 'a^*', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: '-*b', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: '(a**b)', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: '(a/*b)(', errorCode: ErrorCodes.MALFORMED_OPERATORS },
    { input: '((a*b)', errorCode: ErrorCodes.PARENTH_COUNT_MISMATCH },
    { input: '(a*b)(', errorCode: ErrorCodes.PARENTH_COUNT_MISMATCH },
    { input: '(]a*b)(', errorCode: ErrorCodes.PARENTH_COUNT_MISMATCH },
    { input: '(tan[x+(a^((t-y))]*b)', errorCode: ErrorCodes.PARENTH_COUNT_MISMATCH },
    { input: '(tan[x+(a^(t-y))]]*b)', errorCode: ErrorCodes.BRACKET_COUNT_MISMATCH },
    { input: '(tan[x+(a^(t-y))]*b)[', errorCode: ErrorCodes.BRACKET_COUNT_MISMATCH },
    { input: '(a*b))(', errorCode: ErrorCodes.MISORDERED_PARENTH },
    { input: ')(a*b', errorCode: ErrorCodes.MISORDERED_PARENTH },
    { input: ')(', errorCode: ErrorCodes.MISORDERED_PARENTH },
    { input: 'sin[x]]*cos[', errorCode: ErrorCodes.MISORDERED_BRACKETS },
    { input: '()', errorCode: ErrorCodes.EMPTY_PARENTH },
    { input: 'a*()', errorCode: ErrorCodes.EMPTY_PARENTH },
    { input: '((()))', errorCode: ErrorCodes.EMPTY_PARENTH },
    { input: 'ln[]', errorCode: ErrorCodes.EMPTY_BRACKETS },
    { input: '[]', errorCode: ErrorCodes.MISSING_FN_NAME },
    { input: 'a*[]', errorCode: ErrorCodes.MISSING_FN_NAME },
    { input: '6-', errorCode: ErrorCodes.ENDS_WITH_OPERATORS },
    { input: 'x*sin[x]/', errorCode: ErrorCodes.ENDS_WITH_OPERATORS },
    { input: 'x*sin[x]--', errorCode: ErrorCodes.ENDS_WITH_OPERATORS },
    { input: '(a-b)*', errorCode: ErrorCodes.ENDS_WITH_OPERATORS },
];

export function mathObjectConstructorErrorTests<TMathObject extends MathObject, TTest extends MathObjectConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TMathObject
): void {

    describe(`MathObject Failure Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should throw error`, () => {
                expect(() => builder(test)).toThrowMatching((error: Error) => {
                    // console.log('ERROR', error);
                    // console.log('ERROR message', error.message);
                    // console.log('ERROR name', error.name);

                    if (test.errorCode) {
                        return error.message.startsWith(`ERR${test.errorCode}`)
                    }

                    return true;
                });
            });
        });
    });
}

export function mathObjectTraverseTests<TMathObject extends MathObject, TTest extends MathObjectTraverseTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TMathObject,
    childFirst: boolean = false
): void {

    describe(`MathObject Traverse Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should execute function correctly`, () => {
                const root: TMathObject = builder(test);
                // console.log(test);
                // console.log('================');
                // console.log(root);
                // console.log('toString', mo.toString());

                let count = 0;
                let firstChild: any;
                let lastChild: any;
                let lastContext: Context;

                root.traverse(test.type, (mo, ctx) => {
                    // console.log('CONTEXT', ctx);
                    expect(mo).toBeInstanceOf(test.type);
                    expect(mo.toString()).toEqual(ctx.target.toString());
                    expect(ctx.root.toString()).toEqual(root.toString());

                    if (ctx.isRoot) {
                        expect(mo.toString()).toEqual(root.toString());
                        expect(ctx.position.indexPath.length).toEqual(1);
                        expect(ctx.position.index).toEqual(0);
                        expect(ctx.target.toString()).toEqual(root.toString());
                    } else {
                        const index = ctx.position.index;
                        const moId = mo.id;
                        const indexID = (ctx.parentContext as any).target.children[index].id;

                        expect(moId).toEqual(indexID);

                        let level = ctx.position.indexPath.length;
                        let target = ctx.target;

                        while (level > 0) {
                            target = (ctx.parentContext as any).target;
                            level --;
                        }

                        if (!childFirst) {
                            expect(ctx.parentContext).toBeTruthy();
                            const levelIncremented = ctx.position.indexPath.length > (ctx.parentContext as any).position.indexPath.length;
                            const indexIncremented = ctx.position.indexPath.length > (ctx.parentContext as any).position.indexPath.length;
                            expect(levelIncremented || indexIncremented).toBeTrue();
                        }
                    }

                    count++;
                    if (!firstChild) {
                        firstChild = mo;
                    }

                    lastChild = mo;
                    lastContext = ctx;
                }, childFirst);

                expect(count).toEqual(test.count);

                if (test.firstChild) {
                    expect((firstChild as MathObject).toString()).toEqual(test.firstChild);
                } else {
                    expect(firstChild).toBeFalsy()
                }

                if (test.lastChild) {
                    expect((lastChild as MathObject).toString()).toEqual(test.lastChild);
                } else {
                    expect(lastChild).toBeFalsy()
                }
            });
        });
    });
}

export class MathObjectConstTest {
    input: string = '';
    children: string[] = [];
    toString: string = '';
    errorCode?: number;

    constructor(props: Partial<MathObjectConstTest>) {
        Object.assign(this, props);
    }
}

export class MathObjectTraverseTest {
    input: string = '';
    type: any;
    count: number = -1;
    firstChild: string = '';
    lastChild: string = '';

    constructor(props: Partial<MathObjectTraverseTest>) {
        Object.assign(this, props);
    }
}

export class MathObjecReplaceTest {
    input: string = '';
    toStringBefore: string = '';
    toStringAfter: string = '';

    constructor(props: Partial<MathObjecReplaceTest>) {
        Object.assign(this, props);
    }
}

export function mathObjectReplaceTests<TMathObject extends MathObject, TTest extends MathObjecReplaceTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TMathObject,
    replacementBuilder: () => MathObject,
    finder: (mo: TMathObject) => Context | null
): void {

    describe(`MathObject Replace Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should replace child if found and do nothing if not found`, () => {
                const mo: TMathObject = builder(test);
                const replacement: MathObject = replacementBuilder();
                const childCtx = finder(mo);

                if (childCtx) {
                    const newMo = mo.replace(childCtx.target, replacement);
    
                    expect(mo.toString()).toEqual(test.toStringBefore);
                    expect(newMo.toString()).toEqual(test.toStringAfter);
                } else {
                    const newMo = mo.replace(replacement, replacement);
                    expect(newMo.toString()).toEqual(test.toStringBefore);
                }

                const rootReplaced = mo.replace(mo, replacement);
                expect(rootReplaced.toString()).toEqual(replacement.toString());
            });
        });
    });
}