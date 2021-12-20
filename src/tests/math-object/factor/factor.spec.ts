import { Sign } from "src/models/math-object/enums.model";
import { Factor } from "src/models/math-object/factor/factor.model";
import { MathObjectConstTest } from "../math-object.spec";

export class FactorConstTest extends MathObjectConstTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<FactorConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function factorConstructorTests<TFactor extends Factor, TTest extends FactorConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFactor
): void {

    describe(`Factor Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFactor = builder(test);
                // console.log(mo);
                expect(mo.sign).toEqual(test.sign);
            });
        });
    });
}