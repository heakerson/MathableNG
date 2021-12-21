import { Sign } from "src/models/math-object/enums.model";
import { Tan } from "src/models/math-object/factor/functions/trig/tan.model";
import { Factory } from "src/models/services/factory.service";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { TrigConstrTest, trigConstructorTests } from "./trig.spec";

describe('Tan', () => {

    describe('Constructor', () => {
        const constructorTests: TrigConstrTest[] = [
            new TrigConstrTest({ input: 'a', children: ['a'], fnString: 'tan', toString: 'tan[a]', sign: Sign.Positive }),
            new TrigConstrTest({ input: '-a', children: ['-a'], fnString: 'tan', toString: 'tan[-a]', sign: Sign.Positive }),
            new TrigConstrTest({ input: '-a+ c ', children: ['(-a+c)'], fnString: 'tan', toString: '-tan[(-a+c)]', sign: Sign.Negative }),
            new TrigConstrTest({ input: '(-a+ c) ', children: ['(-a+c)'], fnString: 'tan', toString: '-tan[(-a+c)]', sign: Sign.Negative }),
            new TrigConstrTest({ input: 'a/b', children: ['(a/b)'], fnString: 'tan', toString: 'tan[(a/b)]', sign: Sign.Positive }),
            new TrigConstrTest({ input: 'tan[x+t/-v]', children: ['tan[(x+(t/-v))]'], fnString: 'tan', toString: '-tan[tan[(x+(t/-v))]]', sign: Sign.Negative }),
        ];

        const standardBuilder = (test: TrigConstrTest) => new Tan(test.input, test.sign);
        const staticBuilder = (test: TrigConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            return Tan.fromFactor(contents, test.sign);
        };

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        functionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        functionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        trigConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        trigConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});