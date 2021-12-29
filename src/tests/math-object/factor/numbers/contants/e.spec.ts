import { Sign } from "src/models/math-object/enums.model";
import { E } from "src/models/math-object/factor/number/contant/e.model";
import { mathObjectConstructorTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { realNumberConstructorTests, RealNumberTraverseTest } from "../real-number.spec";
import { ConstantConstrTest, constantConstructorTests } from "./constant.spec";

describe('E', () => {

    describe('Constructor', () => {
        const constructorTests: ConstantConstrTest[] = [
            new ConstantConstrTest({ input: 'E', toString: 'E', symbol: 'E', value: Math.E, sign: Sign.Positive }),
            new ConstantConstrTest({ input: '-E', toString: '-E', symbol: 'E', value: -Math.E, sign: Sign.Negative })
        ];

        const standardBuilder = (test: ConstantConstrTest) => new E(test.sign);

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        realNumberConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        constantConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: RealNumberTraverseTest) => new E(test.sign);

            const tests: RealNumberTraverseTest[] = [
                new RealNumberTraverseTest({ input: 'E', type: E, count: 1, firstChild: 'E', lastChild: 'E'}),
                new RealNumberTraverseTest({ input: '-E', type: E, count: 1, firstChild: '-E', lastChild: '-E', sign: Sign.Negative}),
            ];

            const childFirstTests: RealNumberTraverseTest[] = [
                new RealNumberTraverseTest({ input: 'E', type: E, count: 1, firstChild: 'E', lastChild: 'E'}),
                new RealNumberTraverseTest({ input: '-E', type: E, count: 1, firstChild: '-E', lastChild: '-E', sign: Sign.Negative}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
        });
    });
});