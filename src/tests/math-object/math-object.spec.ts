import { MathObject } from "src/models/math-object/math-object.model";
import * as uuid from 'uuid';

export function mathObjectConstructorTests<TMathObject extends MathObject>(
    additionalLabel: string,
    tests: { input: string, children: string[], toString: string }[],
    builder: (input: string) => TMathObject
): void {

    describe(`MathObject Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TMathObject = builder(test.input);
                // console.log(mo);
                expect(uuid.validate(mo.id)).toBeTrue();
                expect(mo.children.map(c => c.toString())).toEqual(test.children);
                expect(mo.toString()).toEqual(test.toString);
                expect(mo.copy().toString()).toEqual(mo.toString());
            });
        });
    });
}
