import { Type } from "@angular/core";
import { MathObject } from "src/models/math-object/math-object.model";
import * as uuid from 'uuid';

export function mathObjectConstructorTests<TMathObject extends MathObject>(
    type: Type<TMathObject>,
    builder: (input: string) => TMathObject,
    tests: { input: string }[]
): void {

    describe(`${type.constructor.name} : MathObject Base Constructor Tests`, () => {
        tests.forEach(test => {
            const mo: TMathObject = builder(test.input);

            expect(uuid.validate(mo.id)).toBeTrue();
        });
    });
}