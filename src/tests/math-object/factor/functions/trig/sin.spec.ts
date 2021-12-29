import { Sign } from "src/models/math-object/enums.model";
import { Sin } from "src/models/math-object/factor/functions/trig/sin.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests, FactorTraverseTest } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { TrigConstrTest, trigConstructorTests } from "./trig.spec";

describe('sin', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: TrigConstrTest) => new Sin(test.input, test.sign);
        const staticBuilder = (test: TrigConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            return Sin.fromFactor(contents, test.sign);
        };

        describe('Success', () => {
            const constructorTests: TrigConstrTest[] = [
                new TrigConstrTest({ input: 'a', children: ['a'], fnString: 'sin', toString: 'sin[a]', sign: Sign.Positive }),
                new TrigConstrTest({ input: '-a', children: ['-a'], fnString: 'sin', toString: 'sin[-a]', sign: Sign.Positive }),
                new TrigConstrTest({ input: '-a+ c ', children: ['(-a+c)'], fnString: 'sin', toString: '-sin[(-a+c)]', sign: Sign.Negative }),
                new TrigConstrTest({ input: '(-a+ c) ', children: ['(-a+c)'], fnString: 'sin', toString: '-sin[(-a+c)]', sign: Sign.Negative }),
                new TrigConstrTest({ input: 'a/b', children: ['(a/b)'], fnString: 'sin', toString: 'sin[(a/b)]', sign: Sign.Positive }),
                new TrigConstrTest({ input: 'sin[x+t/-v]', children: ['sin[(x+(t/-v))]'], fnString: 'sin', toString: '-sin[sin[(x+(t/-v))]]', sign: Sign.Negative }),
            ];
    
    
            mathObjectConstructorTests('SsinDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('SsinDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            functionConstructorTests('SsinDARD Constructor', constructorTests, standardBuilder);
            functionConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            trigConstructorTests('SsinDARD Constructor', constructorTests, standardBuilder);
            trigConstructorTests('STATIC Constructor', constructorTests, staticBuilder); 
        });

        describe('Errors', () => {
            const constructorTests: TrigConstrTest[] = baseMathObjectErrorTests.map(ex => {
                return new TrigConstrTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            })
    
            mathObjectConstructorErrorTests('SsinDARD Constructor', constructorTests, standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Sin(test.input, test.sign);
            const staticBuilder = (test: FactorTraverseTest) => {
                const contents = Factory.buildFactor(test.input);
                return Sin.fromFactor(contents, test.sign);
            };

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Sin, count: 1, firstChild: 'sin[(-a*b)]', lastChild: 'sin[(-a*b)]'}), // search type is root
                new FactorTraverseTest({ input: '(a*sin[(sin[(x)]+y)]*b*sin[(z-t)])', type: Sin, count: 4, firstChild: '-sin[(a*sin[(sin[(x)]+y)]*b*sin[(z-t)])]', lastChild: 'sin[(z-t)]', sign: Sign.Negative}), // search type is root
                new FactorTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new FactorTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new FactorTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(a/(b/c))', lastChild: '(b/c)'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '(-a*b)', type: Sin, count: 1, firstChild: 'sin[(-a*b)]', lastChild: 'sin[(-a*b)]'}), // search type is root
                new FactorTraverseTest({ input: '(a*sin[(sin[(x)]+y)]*b*sin[(z-t)])', type: Sin, count: 4, firstChild: 'sin[(x)]', lastChild: '-sin[(a*sin[(sin[(x)]+y)]*b*sin[(z-t)])]', sign: Sign.Negative}), // search type is root
                new FactorTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new FactorTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new FactorTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(b/c)', lastChild: '(a/(b/c))'}),
            ];

            mathObjectTraverseTests('Parent First SsinDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First SsinDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });
    });
});