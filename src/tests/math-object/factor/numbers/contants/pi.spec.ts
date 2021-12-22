import { Sign } from "src/models/math-object/enums.model";
import { PI } from "src/models/math-object/factor/number/contant/pi.model";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { realNumberConstructorTests } from "../real-number.spec";
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

        describe('', () => {

        });
    });
});