import { Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { E } from "src/models/math-object/factor/number/contant/e.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Variable } from "src/models/math-object/factor/variable.model";
import { MathObject } from "src/models/math-object/math-object.model";
import { ErrorCodes } from "src/models/services/core/error-handler.service";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { baseMathObjectErrorTests, mathObjectConstructorErrorTests, mathObjectConstructorTests, mathObjectReplaceTests, mathObjectTraverseTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest, factorFlipSignTests, FactorReplaceAndFlipSignTest, FactorTraverseTest } from "./factor.spec";

export function rationalConstructorTests<TRational extends Rational, TTest extends FactorConstTest>(
    additionalLabel: string,
    tests: TTest[],
    builder: (test: TTest) => TRational
): void {

    describe(`Rational Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TRational = builder(test);
                // console.log(mo);
                // console.log(mo.toString());
                expect(mo.children.length).toEqual(2);
                expect(mo.numerator.toString()).toEqual(test.children[0]);
                expect(mo.denominator.toString()).toEqual(test.children[1]);
            });
        });
    });
}

describe('Rational', () => {

    describe('Constructor Tests', () => {
        const standardBuilder = (test: FactorConstTest) => new Rational(test.input);
        const staticBuilder = (test: FactorConstTest) => {
            const parsed = StringFormatter.parseRationalExpressions(test.input);
            return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator), test.sign);
        };

        describe('Success', () => {
            const constructorTests: FactorConstTest[] = [
                new FactorConstTest({ input: 'a/b', children: ['a', 'b'], toString: '(a/b)', sign: Sign.Positive }),
                new FactorConstTest({ input: '-a/b', children: ['-a', 'b'], toString: '(-a/b)', sign: Sign.Positive }),
                new FactorConstTest({ input: '-(a/b)', children: ['a', 'b'], toString: '-(a/b)', sign: Sign.Negative }),
                new FactorConstTest({ input: '-a/b/c', children: ['-a', '(b/c)'], toString: '(-a/(b/c))', sign: Sign.Positive }),
                new FactorConstTest({ input: '-a/-b/c', children: ['-a', '(-b/c)'], toString: '(-a/(-b/c))', sign: Sign.Positive }),
                new FactorConstTest({ input: '(-a)/b/c', children: ['(-a)', '(b/c)'], toString: '((-a)/(b/c))', sign: Sign.Positive }),
                new FactorConstTest({ input: '(-a/b)/c', children: ['(-a/b)', 'c'], toString: '((-a/b)/c)', sign: Sign.Positive }),
                new FactorConstTest({ input: '-(a/b/c)', children: ['a', '(b/c)'], toString: '-(a/(b/c))', sign: Sign.Negative }),
                new FactorConstTest({ input: '-(-(a+x)/b/c)', children: ['-(a+x)', '(b/c)'], toString: '-(-(a+x)/(b/c))', sign: Sign.Negative }),
                new FactorConstTest({ input: '((a+x)/(b+c))', children: ['(a+x)', '(b+c)'], toString: '((a+x)/(b+c))', sign: Sign.Positive }),
                new FactorConstTest({ input: '-(-(a+x)/-(b+c))', children: ['-(a+x)', '-(b+c)'], toString: '-(-(a+x)/-(b+c))', sign: Sign.Negative }),
            ];
    
            mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
    
            rationalConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
            rationalConstructorTests('STATIC Constructor', constructorTests, staticBuilder);
        });

        describe('Errors', () => {
            const errorTests: { input: string, errorCode: ErrorCodes }[] = [
                { input: '', errorCode: ErrorCodes.EMPTY },
                { input: '  ', errorCode: ErrorCodes.EMPTY },
                { input: 'a', errorCode: ErrorCodes.Rational.MISSING_NUM_OR_DENOM },
                { input: 'a/', errorCode: ErrorCodes.Rational.MISSING_NUM_OR_DENOM },
                { input: '-a/', errorCode: ErrorCodes.Rational.MISSING_NUM_OR_DENOM },
                { input: '/b', errorCode: ErrorCodes.Rational.MISSING_NUM_OR_DENOM },
                { input: '/-b', errorCode: ErrorCodes.Rational.MISSING_NUM_OR_DENOM },
            ]

            const tests = errorTests.map(e => new FactorConstTest({ input: e.input, children: [], toString: '' }));
            const baseTestsNum = baseMathObjectErrorTests.map(e => new FactorConstTest({ input: `${e.input}/x`, children: [], toString: '' }));
            const baseTestsDemom = baseMathObjectErrorTests.map(e => new FactorConstTest({ input: `x/${e.input}`, children: [], toString: '' }));

            mathObjectConstructorErrorTests('STANDARD Constructor', [...tests, ...baseTestsNum, ...baseTestsDemom], standardBuilder);
        })

    });

    describe('Individual Methods', () => {

        describe('Traverse', () => {
            const standardBuilder = (test: FactorTraverseTest) => new Rational(test.input);
            const staticBuilder = (test: FactorTraverseTest) => {
                const parsed = StringFormatter.parseRationalExpressions(test.input);
                return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator), test.sign);
            };

            const tests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '-a/b', type: Rational, count: 1, firstChild: '(-a/b)', lastChild: '(-a/b)'}), // search type is root
                new FactorTraverseTest({ input: '(-a/(b/(c+(x/y))))', type: Rational, count: 3, firstChild: '(-a/(b/(c+(x/y))))', lastChild: '(x/y)'}), // search type is root
                new FactorTraverseTest({ input: '(-(x^(a-b))/(y))', type: Expression, count: 3, firstChild: '-(x^(a-b))', lastChild: '(y)'}),
                new FactorTraverseTest({ input: '-E/(b+x+E)', type: E, count: 2, firstChild: '-E', lastChild: 'E'}),
            ];

            const childFirstTests: FactorTraverseTest[] = [
                new FactorTraverseTest({ input: '-a/b', type: Rational, count: 1, firstChild: '(-a/b)', lastChild: '(-a/b)'}), // search type is root
                new FactorTraverseTest({ input: '(-a/(b/(c+(x/y))))', type: Rational, count: 3, firstChild: '(x/y)', lastChild: '(-a/(b/(c+(x/y))))'}), // search type is root
                new FactorTraverseTest({ input: '(-(x^(a-b))/(y))', type: Expression, count: 3, firstChild: '(a-b)', lastChild: '(y)'}),
                new FactorTraverseTest({ input: '-E/(b+x+E)', type: E, count: 2, firstChild: '-E', lastChild: 'E'}),
            ];

            mathObjectTraverseTests('Parent First STANDARD', tests, standardBuilder, false);
            mathObjectTraverseTests('Parent First STATIC', tests, staticBuilder, false);
            mathObjectTraverseTests('Child First STANDARD', childFirstTests, standardBuilder, true);
            mathObjectTraverseTests('Child First STATIC', childFirstTests, staticBuilder, true);
        });

        describe('Replace', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Rational(test.input);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const parsed = StringFormatter.parseRationalExpressions(test.input);
                return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator), test.sign);
            };

            const finder = (mo: MathObject) => mo.find(Variable, (m: Variable) => m.name === 'x' && m.sign === Sign.Positive);
            const replacement = () => new Variable('-z');

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: '(a/x)', toStringBefore: '(a/x)', toStringAfter: '(a/-z)' }),
                new FactorReplaceAndFlipSignTest({ input: '(a/b)', toStringBefore: '(a/b)', toStringAfter: '(a/b)' }),
                new FactorReplaceAndFlipSignTest({ input: '(x/a)', toStringBefore: '(x/a)', toStringAfter: '(-z/a)' }),
                new FactorReplaceAndFlipSignTest({ input: '-(x/a)', toStringBefore: '-(x/a)', toStringAfter: '-(-z/a)', sign: Sign.Negative }),
                new FactorReplaceAndFlipSignTest({ input: 'g/(a*(sin[a^(s-r*(p+(x/d)))])*b*x)', toStringBefore: '(g/(a*(sin[a^(s-r*(p+(x/d)))])*b*x))', toStringAfter: '(g/(a*(sin[a^(s-r*(p+(-z/d)))])*b*x))' }),
            ];

            mathObjectReplaceTests('STANDARD Constructor', tests, standardBuilder, replacement, finder);
            mathObjectReplaceTests('STATIC Constructor', tests, staticBuilder, replacement, finder);
        });

        describe('FlipSign', () => {
            const standardBuilder = (test: FactorReplaceAndFlipSignTest) => new Rational(test.input);
            const staticBuilder = (test: FactorReplaceAndFlipSignTest) => {
                const parsed = StringFormatter.parseRationalExpressions(test.input);
                return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator), test.sign);
            };

            const tests: FactorReplaceAndFlipSignTest[] = [
                new FactorReplaceAndFlipSignTest({ input: '(a/x)', toStringBefore: '(a/x)', toStringAfter: '-(a/x)' }),
                new FactorReplaceAndFlipSignTest({ input: '(a/(x+y))', toStringBefore: '(a/(x+y))', toStringAfter: '-(a/(x+y))' }),
                new FactorReplaceAndFlipSignTest({ input: '-(x/a)', toStringBefore: '-(x/a)', toStringAfter: '(x/a)', sign: Sign.Negative })
            ];

            factorFlipSignTests('STANDARD Constructor', tests, standardBuilder);
            factorFlipSignTests('STATIC Constructor', tests, staticBuilder);
        });
    });
});