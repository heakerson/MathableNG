import { Sign } from "src/models/math-object/enums.model";
import { E } from "src/models/math-object/factor/number/contant/e.model";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { realNumberConstructorTests } from "../real-number.spec";
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

        describe('', () => {

        });
    });
});