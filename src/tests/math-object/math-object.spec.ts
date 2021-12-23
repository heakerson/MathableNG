import { MathObject } from "src/models/math-object/math-object.model";
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

export function mathObjectConstructorErrorTests<TMathObject extends MathObject, TTest extends MathObjectConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TMathObject
): void {

    describe(`MathObject Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should throw error`, () => {
                // console.log(mo);
                // console.log(mo.toString());
                expect(() => builder(test)).toThrowError();
            });
        });
    });
}

export class MathObjectConstTest {
    input: string = '';
    children: string[] = [];
    toString: string = '';

    constructor(props: Partial<MathObjectConstTest>) {
        Object.assign(this, props);
    }
}
