import { Sign } from "src/models/math-object/enums.model";
import { Ln } from "src/models/math-object/factor/functions/log/ln.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests } from "../../factor.spec";
import { functionConstructorTests } from "../function.spec";
import { LogConstrTest, logConstructorTests, LogReplaceTest, LogTraverseTest } from "./log.spec";

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
            const constructorTests: LogConstrTest[] = baseMathObjectErrorTests.map(ex => {
                return new LogConstrTest({ input: ex.input, errorCode: ex.errorCode, children: [], toString: '' });
            })
    
            mathObjectConstructorErrorTests('STANDARD Constructor', constructorTests, standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: LogTraverseTest) => new Ln(test.input, test.sign);
            const staticBuilder = (test: LogTraverseTest) =>  Ln.fromFactors(Factory.buildFactor(test.input), test.sign);

            const tests: LogTraverseTest[] = [
                new LogTraverseTest({ input: '(-a*b)', type: Ln, count: 1, firstChild: 'ln[(-a*b)]', lastChild: 'ln[(-a*b)]'}), // search type is root
                new LogTraverseTest({ input: '(a*ln[(ln[(x)]+y)]*b*ln[(z-t)])', type: Ln, count: 4, firstChild: '-ln[(a*ln[(ln[(x)]+y)]*b*ln[(z-t)])]', lastChild: 'ln[(z-t)]', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new LogTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new LogTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(a/(b/c))', lastChild: '(b/c)'}),
            ];

            const childFirstTests: LogTraverseTest[] = [
                new LogTraverseTest({ input: '(-a*b)', type: Ln, count: 1, firstChild: 'ln[(-a*b)]', lastChild: 'ln[(-a*b)]'}), // search type is root
                new LogTraverseTest({ input: '(a*ln[(ln[(x)]+y)]*b*ln[(z-t)])', type: Ln, count: 4, firstChild: 'ln[(x)]', lastChild: '-ln[(a*ln[(ln[(x)]+y)]*b*ln[(z-t)])]', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6'}),
                new LogTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5'}),
                new LogTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(b/c)', lastChild: '(a/(b/c))'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });

        describe('Replace', () => {
            const standardBuilder = (test: LogReplaceTest) => new Ln(test.input, test.sign);
            const staticBuilder = (test: LogReplaceTest) =>  Ln.fromFactors(Factory.buildFactor(test.input), test.sign);
    
            const finder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');
    
            const tests: LogReplaceTest[] = [
                new LogReplaceTest({ input: 'a^x', toStringBefore: 'ln[a^x]', toStringAfter: 'ln[a^-z]'}),
                new LogReplaceTest({ input: 'x^a', toStringBefore: 'ln[x^a]', toStringAfter: 'ln[-z^a]' }),
                new LogReplaceTest({ input: 'a^b', toStringBefore: '-ln[a^b]', toStringAfter: '-ln[a^b]', sign: Sign.Negative }),
                new LogReplaceTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: 'ln[g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)]', toStringAfter: 'ln[g^(a*(sin[a^(s-r*(p+(-z/d)))])*b*x)]' }),
            ];
    
            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
            mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);
    
    
            const finderRoot = (mo: MathObject) => mo.find(Ln, (m: Ln) => m.sign === Sign.Positive);
            const replacementRoot = () => new Variable('x');
    
            const rootTests: LogReplaceTest[] = [
                new LogReplaceTest({ input: 'y', toStringBefore: 'ln[y]', toStringAfter: 'x' }),
                new LogReplaceTest({ input: 'log[y]', toStringBefore: 'ln[log[y,10]]', toStringAfter: 'x' }),
            ];
    
            mathObjectReplaceTests('STANDARD Constructor - replace root', rootTests, standardBuilder, replacementRoot, finderRoot);
            mathObjectReplaceTests('STATIC Constructor - replace root', rootTests, staticBuilder, replacementRoot, finderRoot);
        });
    });
});