import { Sign } from "src/models/math-object/enums.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../factor.spec";
import { RealNumberConstrTest, realNumberConstructorTests } from "./real-number.spec";


export function integerConstructorTests<TInteger extends Integer, TTest extends RealNumberConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TInteger
): void {

    describe(`Integer Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TInteger = builder(test);
                // console.log(mo);
                expect(mo.isEven).toEqual(test.value % 2 === 0);
            });
        });
    });
}

describe('Double', () => {

    describe('Constructor', () => {
        const constructorTests: RealNumberConstrTest[] = [
            new RealNumberConstrTest({ input: '1', toString: '1', value: 1, sign: Sign.Positive }),
            new RealNumberConstrTest({ input: '-1', toString: '-1', value: -1, sign: Sign.Negative }),
            new RealNumberConstrTest({ input: '-47', toString: '-47', value: -47, sign: Sign.Negative }),
            new RealNumberConstrTest({ input: '0', toString: '0', value: 0, sign: Sign.Positive }),
            new RealNumberConstrTest({ input: '50', toString: '50', value: 50, sign: Sign.Positive }),
            new RealNumberConstrTest({ input: '123123123123123', toString: '123123123123123', value: 123123123123123, sign: Sign.Positive }),
        ];

        const standardBuilder = (test: RealNumberConstrTest) => new Integer(test.input);
        const staticBuilder = (test: RealNumberConstrTest) => Integer.fromNumber(test.value);

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        realNumberConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        realNumberConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        integerConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        integerConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});