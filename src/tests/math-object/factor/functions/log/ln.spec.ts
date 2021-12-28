import { Sign } from "src/models/math-object/enums.model";
import { Ln } from "src/models/math-object/factor/functions/log/ln.model";
import { Factory } from "src/models/services/factory.service";
import { mathObjectConstructorTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { LogConstrTest, logConstructorTests } from "./log.spec";

describe('Ln', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: LogConstrTest) => new Ln(test.input, test.sign);
        const staticBuilder = (test: LogConstrTest) =>  Ln.fromFactors(Factory.buildFactor(test.input), test.sign);

        describe('Success', () => {
            const constructorTests: LogConstrTest[] = [
                new LogConstrTest({ input: 'a', children: ['a', 'E'], fnString: 'ln', toString: 'ln[a]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a', children: ['-a', 'E'], fnString: 'ln', toString: 'ln[-a]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a+ c ', children: ['(-a+c)', 'E'], fnString: 'ln', toString: '-ln[(-a+c)]', sign: Sign.Negative }),
                new LogConstrTest({ input: '(-a+ c) ', children: ['(-a+c)', 'E'], fnString: 'ln', toString: '-ln[(-a+c)]', sign: Sign.Negative }),
                new LogConstrTest({ input: 'a/b', children: ['(a/b)', 'E'], fnString: 'ln', toString: 'ln[(a/b)]', sign: Sign.Positive }),
                new LogConstrTest({ input: 'sin[x+t/-v]', children: ['sin[(x+(t/-v))]', 'E'], fnString: 'ln', toString: '-ln[sin[(x+(t/-v))]]', sign: Sign.Negative }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            functionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            functionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            logConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            logConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            
        });
    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});