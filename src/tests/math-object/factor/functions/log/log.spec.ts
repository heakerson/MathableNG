import { Sign } from "src/models/math-object/enums.model";
import { Log } from "src/models/math-object/factor/functions/log/log.model";
import { Double } from "src/models/math-object/factor/number/double.model";
import { Integer } from "src/models/math-object/factor/number/integer.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { Factory } from "src/models/services/factory.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "src/tests/math-object/math-object.spec";
import { factorConstructorTests, FactorReplaceAndFlipSignTest, FactorTraverseTest } from "../../factor.spec";
import { FuncConstrTest, functionConstructorTests } from "../function.spec";

export class LogConstrTest extends FuncConstrTest {
    base?: string = undefined;

    constructor(props: Partial<LogConstrTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class LogTraverseTest extends FactorTraverseTest {
    base?: string = undefined;

    constructor(props: Partial<LogTraverseTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export class LogReplaceTest extends FactorReplaceAndFlipSignTest {
    base?: string = undefined;

    constructor(props: Partial<LogReplaceTest>) {
        super(props);
        Object.assign(this, props);
    }
}

export function logConstructorTests<TFunction extends Log, TTest extends LogConstrTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TFunction
): void {

    describe(`Log Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TFunction = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.contents.toString()).toEqual(test.children[0]);
                expect(mo.base.toString()).toEqual(test.children[1]);
            });
        });
    });
}

describe('Log', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: LogConstrTest) => new Log(test.input, test.sign, test.base);
        const staticBuilder = (test: LogConstrTest) => {
            const contents = Factory.buildFactor(test.input);
            const base: any = test.base ? Factory.buildFactor(test.base) : undefined;
            return Log.fromFactors(contents, test.sign, base);
        };

        describe('Success', () => {
            const constructorTests: LogConstrTest[] = [
                new LogConstrTest({ input: 'a', base: '10', children: ['a', '10'], fnString: 'log', toString: 'log[a,10]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a', base: 'x', children: ['-a', 'x'], fnString: 'log', toString: 'log[-a,x]', sign: Sign.Positive }),
                new LogConstrTest({ input: '-a+ c ', children: ['(-a+c)', '10'], fnString: 'log', toString: '-log[(-a+c),10]', sign: Sign.Negative }),
                new LogConstrTest({ input: '(-a+ c) ', base: 'a+b', children: ['(-a+c)', '(a+b)'], fnString: 'log', toString: '-log[(-a+c),(a+b)]', sign: Sign.Negative }),
                new LogConstrTest({ input: 'a/b', base: 'E', children: ['(a/b)', 'E'], fnString: 'log', toString: 'log[(a/b),E]', sign: Sign.Positive }),
                new LogConstrTest({ input: 'sin[x+t/-v]', children: ['sin[(x+(t/-v))]', '10'], fnString: 'log', toString: '-log[sin[(x+(t/-v))],10]', sign: Sign.Negative }),
                new LogConstrTest({ input: 'log[x,10]', children: ['log[x,10]', '10'], fnString: 'log', toString: 'log[log[x,10],10]'})
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
            const baseTestsContents = baseMathObjectErrorTests.map(e => new LogConstrTest({ input: `${e.input}`, children: [], toString: '' }));
            const baseTestsBase = baseMathObjectErrorTests.map(e => new LogConstrTest({ input: `x`, base: e.input, children: [], toString: '' }));

            mathObjectConstructorErrorTests('STANDARD Constructor', [...baseTestsContents, ...baseTestsBase], standardBuilder);
        });
    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: LogTraverseTest) => new Log(test.input, test.sign, test.base);
            const staticBuilder = (test: LogTraverseTest) => {
                const contents = Factory.buildFactor(test.input);
                const base: any = test.base ? Factory.buildFactor(test.base) : undefined;
                return Log.fromFactors(contents, test.sign, base);
            };

            const tests: LogTraverseTest[] = [
                new LogTraverseTest({ input: '(-a*b)', type: Log, count: 1, firstChild: '-log[(-a*b),x]', lastChild: '-log[(-a*b),x]', base: 'x', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(-a*b)', type: Log, count: 1, firstChild: 'log[(-a*b),10]', lastChild: 'log[(-a*b),10]'}), // search type is root
                new LogTraverseTest({ input: '(a*log[(log[(x),10]+y),10]*b*log[(z-t),10])', type: Log, count: 4, firstChild: '-log[(a*log[(log[(x),10]+y),10]*b*log[(z-t),10]),10]', lastChild: 'log[(z-t),10]', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6', base: 'x'}),
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 3, firstChild: '3.7', lastChild: '10'}),
                new LogTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5', base: 'y'}),
                new LogTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(a/(b/c))', lastChild: '(b/c)'}),
            ];

            const childFirstTests: LogTraverseTest[] = [
                new LogTraverseTest({ input: '(-a*b)', type: Log, count: 1, firstChild: '-log[(-a*b),x]', lastChild: '-log[(-a*b),x]', base: 'x', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(-a*b)', type: Log, count: 1, firstChild: 'log[(-a*b),10]', lastChild: 'log[(-a*b),10]'}), // search type is root
                new LogTraverseTest({ input: '(a*log[(log[(x),10]+y),10]*b*log[(z-t),10])', type: Log, count: 4, firstChild: 'log[(x),10]', lastChild: '-log[(a*log[(log[(x),10]+y),10]*b*log[(z-t),10]),10]', sign: Sign.Negative}), // search type is root
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 2, firstChild: '3.7', lastChild: '-0.6', base: 'x'}),
                new LogTraverseTest({ input: '(a*3.7*b*-.6)', type: Double, count: 3, firstChild: '3.7', lastChild: '10'}),
                new LogTraverseTest({ input: 'a*b^1*b^0^y^5', type: Integer, count: 3, firstChild: '1', lastChild: '5', base: 'y'}),
                new LogTraverseTest({ input: 'a/b/c', type: Rational, count: 2, firstChild: '(b/c)', lastChild: '(a/(b/c))'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });
    });

    describe('Replace', () => {
        const standardBuilder = (test: LogReplaceTest) => new Log(test.input, test.sign, test.base);
        const staticBuilder = (test: LogReplaceTest) => {
            const contents = Factory.buildFactor(test.input);
            const base: any = test.base ? Factory.buildFactor(test.base) : undefined;
            return Log.fromFactors(contents, test.sign, base);
        };

        const finder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
        const replacement = () => new Variable('-z');

        const tests: LogReplaceTest[] = [
            new LogReplaceTest({ input: 'a^x', toStringBefore: 'log[a^x,10]', toStringAfter: 'log[a^-z,10]'}),
            new LogReplaceTest({ input: 'x^a', toStringBefore: 'log[x^a,y]', toStringAfter: 'log[-z^a,y]', base: 'y' }),
            new LogReplaceTest({ input: 'a^b', toStringBefore: '-log[a^b,10]', toStringAfter: '-log[a^b,10]', sign: Sign.Negative }),
            new LogReplaceTest({ input: 'g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: 'log[g^(a*(sin[a^(s-r*(p+(x/d)))])*b*x),10]', toStringAfter: 'log[g^(a*(sin[a^(s-r*(p+(-z/d)))])*b*x),10]' }),
        ];

        mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
        mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);


        const finderRoot = (mo: MathObject) => mo.find(Log, (m: Log) => m.sign === Sign.Positive);
        const replacementRoot = () => new Variable('x');

        const rootTests: LogReplaceTest[] = [
            new LogReplaceTest({ input: 'y', toStringBefore: 'log[y,10]', toStringAfter: 'x' }),
            new LogReplaceTest({ input: 'log[y]', toStringBefore: 'log[log[y,10],8]', toStringAfter: 'x', base: '8' }),
        ];

        mathObjectReplaceTests('STANDARD Constructor - replace root', rootTests, standardBuilder, replacementRoot, finderRoot);
        mathObjectReplaceTests('STATIC Constructor - replace root', rootTests, staticBuilder, replacementRoot, finderRoot);
    });
});