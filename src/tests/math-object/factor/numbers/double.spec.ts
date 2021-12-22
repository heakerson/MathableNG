import { Sign } from "src/models/math-object/enums.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../factor.spec";
import { RealNumberConstrTest, realNumberConstructorTests } from "./real-number.spec";

describe('Double', () => {

    fdescribe('Constructor', () => {
        const constructorTests: RealNumberConstrTest[] = [
            new RealNumberConstrTest({ input: '1', toString: '1', value: 1, sign: Sign.Positive }),
            new RealNumberConstrTest({ input: '-1', toString: '-1', value: -1, sign: Sign.Negative }),
            new RealNumberConstrTest({ input: '-1.004', toString: '-1.004', value: -1.004, sign: Sign.Negative }),
            new RealNumberConstrTest({ input: '0', toString: '0', value: 0, sign: Sign.Positive }),
            new RealNumberConstrTest({ input: '-37.000000000007', toString: '-37.000000000007', value: -37.000000000007, sign: Sign.Negative }),
        ];

        const standardBuilder = (test: RealNumberConstrTest) => new Double(test.input);
        const staticBuilder = (test: RealNumberConstrTest) => Double.fromNumber(test.value);

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        realNumberConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        realNumberConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});