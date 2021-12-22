import { Constant } from "src/models/math-object/factor/number/contant/constant.model";
import { RealNumberConstrTest } from "../real-number.spec";

export class ConstantConstrTest extends RealNumberConstrTest {
    symbol: string = '';

    constructor(props: Partial<ConstantConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function constantConstructorTests<TConstant extends Constant, TTest extends ConstantConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TConstant
): void {

    describe(`Constant Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TConstant = builder(test);
                // console.log(mo);
                expect(mo.symbol).toEqual(test.symbol);
            });
        });
    });
}