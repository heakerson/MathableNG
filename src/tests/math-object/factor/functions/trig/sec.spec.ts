import { Sign } from "src/models/math-object/enums.model";
import { Sec } from "src/models/math-object/factor/functions/trig/sec.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests, factorFlipSignTests, FactorReplaceAndFlipSignTest, FactorTraverseTest } from "../../factor.spec";
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

        describe('Replace', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Sec(test.input, test.sign);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const contents = Factory.buildFactor(test.input);
                return Sec.fromFactor(contents, test.sign);
            };

            const finder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a^x', toStringBefore: 'sec[a^x]', toStringAfter: 'sec[a^-z]' }),
                new FactorReplaceAndFlipSignTest({ input: 'x^a', toStringBefore: 'sec[x^a]', toStringAfter: 'sec[-z^a]' }),
                new FactorReplaceAndFlipSignTest({ input: 'a^b', toStringBefore: '-sec[a^b]', toStringAfter: '-sec[a^b]', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: 'sec[g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)]', toStringAfter: 'sec[g^(a*(sin[a^(s-r*(p+(-z/d)))])*b*x)]' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
            mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);


            const finderRoot = (mo: MathObject) => mo.find(Sec, (m: Sec) => m.sign === Sign.Positive);
            const replacementRoot = () => new Variable('x');

            const rootTests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'y', toStringBefore: 'sec[y]', toStringAfter: 'x' }),
                new FactorReplaceAndFlipSignTest({ input: 'log[y]', toStringBefore: 'sec[log[y,10]]', toStringAfter: 'x' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor - replace root', rootTests, standardBuilder, replacementRoot, finderRoot);
            mathObjectReplaceTests('STATIC Constructor - replace root', rootTests, staticBuilder, replacementRoot, finderRoot);
        });

        describe('FlipSign', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Sec(test.input, test.sign);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const contents = Factory.buildFactor(test.input);
                return Sec.fromFactor(contents, test.sign);
            };

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: 'a^x', toStringBefore: 'sec[a^x]', toStringAfter: '-sec[a^x]' }),
                new FactorReplaceAndFlipSignTest({ input: 'a^b', toStringBefore: '-sec[a^b]', toStringAfter: 'sec[a^b]', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: 'sec[g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)]', toStringAfter: '-sec[g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)]' }),
            ];

            factorFlipSignTests('STANDARD Constructor', tests, standardBuilder);
            factorFlipSignTests('STATIC Constructor', tests, staticBuilder);
        });
    });
});