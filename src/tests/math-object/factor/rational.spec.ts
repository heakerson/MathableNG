import { Sign } from "src/models/math-object/enums.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { Factory } from "src/models/services/factory.service";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests, FactorConstTest } from "./factor.spec";

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

    describe('Constructor', () => {
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

        const standardBuilder = (test: FactorConstTest) => new Rational(test.input);
        const staticBuilder = (test: FactorConstTest) => {
            const parsed = StringFormatter.parseRationalExpressions(test.input);
            return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator), test.sign);
        };

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        mathObjectConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        factorConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        factorConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

        rationalConstructorTests('STANDARD Constructor', constructorTests, standardBuilder);
        rationalConstructorTests('STATIC Constructor', constructorTests, staticBuilder);

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});