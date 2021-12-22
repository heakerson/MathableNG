import { Sign } from "src/models/math-object/enums.model";
import { Csc } from "src/models/math-object/factor/functions/trig/csc.model";
import { Factory } from "src/models/services/factory.service";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { TrigConstrTest, trigConstructorTests } from "./trig.spec";

describe('Csc', () => {

    describe('Constructor', () => {
        const constructorTests: TrigConstrTest[] = [
            new TrigConstrTest({ input: 'a', children: ['a'], fnString: 'csc', toString: 'csc[a]', sign: Sign.Positive }),
            new TrigConstrTest({ input: '-a', children: ['-a'], fnString: 'csc', toString: 'csc[-a]', sign: Sign.Positive }),
            new TrigConstrTest({ input: '-a+ c ', children: ['(-a+c)'], fnString: 'csc', toString: '-csc[(-a+c)]', sign: Sign.Negative }),
            new TrigConstrTest({ input: '(-a+ c) ', children: ['(-a+c)'], fnString: 'csc', toString: '-csc[(-a+c)]', sign: Sign.Negative }),
            new TrigConstrTest({ input: 'a/b', children: ['(a/b)'], fnString: 'csc', toString: 'csc[(a/b)]', sign: Sign.Positive }),
            new TrigConstrTest({ input: 'tan[x+t/-v]', children: ['tan[(x+(t/-v))]'], fnString: 'csc', toString: '-csc[tan[(x+(t/-v))]]', sign: Sign.Negative }),
        ];

        const standardBuilder = (test: TrigConstrTest) => new Csc(test.input, test.sign);
        const staticBuilder = (test: TrigConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            return Csc.fromFactor(contents, test.sign);
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