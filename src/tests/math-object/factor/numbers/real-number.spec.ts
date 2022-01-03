import { RealNumber } from "src/models/math-object/factor/number/real-number.model";
import { FactorConstTest, FactorReplaceAndFlipSignTest, FactorTraverseTest } from "../factor.spec";

export class RealNumberConstrTest extends FactorConstTest {
    value: number = NaN;

    constructor(props: Partial<RealNumberConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class RealNumberTraverseTest extends FactorTraverseTest {
    value: number = NaN;

    constructor(props: Partial<RealNumberTraverseTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class RealNumberReplaceTest extends FactorReplaceAndFlipSignTest {
    value: number = NaN;

    constructor(props: Partial<RealNumberReplaceTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function realNumberConstructorTests<TRealNumber extends RealNumber, TTest extends RealNumberConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TRealNumber
): void {

    describe(`Real Number Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TRealNumber = builder(test);
                // console.log(mo);
                expect(mo.value).toEqual(test.value);
                expect(mo.children).toEqual([]);
            });
        });
    });
}