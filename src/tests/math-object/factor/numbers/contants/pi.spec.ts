import { Sign } from "src/models/math-object/enums.model";
import { PI } from "src/models/math-object/factor/number/contant/pi.model";
import { mathObjectConstructorTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { realNumberConstructorTests, RealNumberTraverseTest } from "../real-number.spec";
import { ConstantConstrTest, constantConstructorTests } from "./constant.spec";

describe('PI', () => {

    describe('Constructor', () => {
        const constructorTests: ConstantConstrTest[] = [
            new ConstantConstrTest({ input: 'PI', toString: 'PI', symbol: 'PI', value: Math.PI, sign: Sign.Positive }),
            new ConstantConstrTest({ input: '-PI', toString: '-PI', symbol: 'PI', value: -Math.PI, sign: Sign.Negative })
        ];

        const standardBuilder = (test: ConstantConstrTest) => new PI(test.sign);

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        realNumberConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);

        constantConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: RealNumberTraverseTest) => new PI(test.sign);

            const tests: RealNumberTraverseTest[] = [
                new RealNumberTraverseTest({ input: 'PI', type: PI, count: 1, firstChild: 'PI', lastChild: 'PI'}),
                new RealNumberTraverseTest({ input: '-PI', type: PI, count: 1, firstChild: '-PI', lastChild: '-PI', sign: Sign.Negative}),
            ];

            const childFirstTests: RealNumberTraverseTest[] = [
                new RealNumberTraverseTest({ input: 'PI', type: PI, count: 1, firstChild: 'PI', lastChild: 'PI'}),
                new RealNumberTraverseTest({ input: '-PI', type: PI, count: 1, firstChild: '-PI', lastChild: '-PI', sign: Sign.Negative}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
        });
    });
});