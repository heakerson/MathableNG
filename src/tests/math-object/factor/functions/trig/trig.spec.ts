import { Trig } from "src/models/math-object/factor/functions/trig/trig.model";
import { FuncConstrTest } from "../function.spec";

export class TrigConstrTest extends FuncConstrTest {
    constructor(props: Partial<TrigConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function trigConstructorTests<TFunction extends Trig, TTest extends TrigConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFunction
): void {

    describe(`Trig Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFunction = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.contents.toString()).toEqual(test.children[0]);
            });
        });
    });
}