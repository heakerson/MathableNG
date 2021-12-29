import { Sign } from "src/models/math-object/enums.model";
import { Sec } from "src/models/math-object/factor/functions/trig/sec.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests, FactorTraverseTest } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { TrigConstrTest, trigConstructorTests } from "./trig.spec";

describe('Sec', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: TrigConstrTest) => new Sec(test.input, test.sign);
        const staticBuilder = (test: TrigConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            return Sec.fromFactor(contents, test.sign);
        };

        describe('Success', () => {
            const constructorTests: TrigConstrTest[] = [
                new TrigConstrTest({ input: 'a', children: ['a'], fnString: 'sec', toString: 'sec[a]', sign: Sign.Positive }),
                new TrigConstrTest({ input: '-a', children: ['-a'], fnString: 'sec', toString: 'sec[-a]', sign: Sign.Positive }),
                new TrigConstrTest({ input: '-a+ c ', children: ['(-a+c)'], fnString: 'sec', toString: '-sec[(-a+c)]', sign: Sign.Negative }),
                new TrigConstrTest({ input: '(-a+ c) ', children: ['(-a+c)'], fnString: 'sec', toString: '-sec[(-a+c)]', sign: Sign.Negative }),
                new TrigConstrTest({ input: 'a/b', children: ['(a/b)'], fnString: 'sec', toString: 'sec[(a/b)]', sign: Sign.Positive }),
                new TrigConstrTest({ input: 'sec[x+t/-v]', children: ['sec[(x+(t/-v))]'], fnString: 'sec', toString: '-sec[sec[(x+(t/-v))]]', sign: Sign.Negative }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            functionConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            functionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            trigConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            trigConstructorTests('STATIC Constructor', constructorTests, staticBuilder);            
        });

        describe('Errors', () => {
            const constructorTests: TrigConstrTest[] = baseMathObjectErrorTests.map(ex => {
                return new TrigConstrTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            })
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Sec(test.input, test.sign);
            const staticBuilder = (test: FactorTraverseTest) => {
                const contents = Factory.buildFactor(test.input);
                return Sec.fromFactor(contents, test.sign);
            };

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Sec, count: 1, firstChild: 'sec[(-a*b)]', lastChild: 'sec[(-a*b)]'}), // search type is root
                new FactorTraverseTest({ input: '(a*sec[(sec[(x)]+y)]*b*sec[(z-t)])', type: Sec, count: 4, firstChild: '-sec[(a*sec[(sec[(x)]+y)]*b*sec[(z-t)])]', lastChild: 'sec[(z-t)]', sign: Sign.Negative}), // search type is root
                new FactorTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new FactorTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new FactorTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(a/(b/c))', lastChild: '(b/c)'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Sec, count: 1, firstChild: 'sec[(-a*b)]', lastChild: 'sec[(-a*b)]'}), // search type is root
                new FactorTraverseTest({ input: '(a*sec[(sec[(x)]+y)]*b*sec[(z-t)])', type: Sec, count: 4, firstChild: 'sec[(x)]', lastChild: '-sec[(a*sec[(sec[(x)]+y)]*b*sec[(z-t)])]', sign: Sign.Negative}), // search type is root
                new FactorTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new FactorTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new FactorTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(b/c)', lastChild: '(a/(b/c))'}),
            ];

            mathObjectTraverseTests('Parent First SsecDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First SsecDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });
    });
});