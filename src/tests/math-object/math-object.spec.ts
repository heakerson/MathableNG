import { MathObject } from "src/models/math-object/math-object.model";
import { ErrorCodes } from "src/models/services/error-handler.service";
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

export class MathObjectConstTest {
    input: string = '';
    children: string[] = [];
    toString: string = '';
    errorCode?: number;

    constructor(props: Partial<MathObjectConstTest>) {
        Object.assign(this, props);
    }
}
