import { Sign } from "src/models/math-object/enums.model";
import { Factor } from "src/models/math-object/factor/factor.model";
import { MathObjecReplaceTest, MathObjectConstTest, MathObjectTraverseTest } from "../math-object.spec";

export class FactorConstTest extends MathObjectConstTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<FactorConstTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class FactorTraverseTest extends MathObjectTraverseTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<FactorTraverseTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class FactorReplaceAndFlipSignTest extends MathObjecReplaceTest {
    sign: Sign = Sign.Positive;

    constructor(props: Partial<FactorReplaceAndFlipSignTest>) {
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

export function factorFlipSignTests<TFactor extends Factor, TTest extends FactorReplaceAndFlipSignTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFactor
): void {

    describe(`MathObject Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach((test: TTest) => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFactor = builder(test);
                const flipped = mo.flipSign();
                // console.log(test);
                // console.log(mo);
                // console.log('toString', mo.toString());
                expect(mo.toString()).toEqual(test.toStringBefore);
                expect(flipped.toString()).toEqual(test.toStringAfter);
                expect(flipped.sign).not.toEqual(mo.sign);
            });
        });
    });
}