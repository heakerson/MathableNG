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
        const constructorTests: { input: string, children: string[], toString: string, sign: Sign }[] = [
            { input: 'a/b', children: ['a', 'b'], toString: '(a/b)', sign: Sign.Positive },
            { input: '-a/b', children: ['-a', 'b'], toString: '(-a/b)', sign: Sign.Positive },
            // { input: '-(a/b)', children: ['a', 'b'], toString: '-(a/b)', sign: Sign.Negative },
            // { input: '-a/b/c', children: ['-a', '(b/c)'], toString: '(-a/(b/c))', sign: Sign.Positive },
            // { input: '-a/-b/c', children: ['-a', '(-b/c)'], toString: '(-a/(b/c))', sign: Sign.Positive },
            // { input: '(-a)/b/c', children: ['(-a)', '(b/c)'], toString: '(-a/(b/c))', sign: Sign.Positive },
            // { input: '(-a/b)/c', children: ['(-a/b)', 'c'], toString: '(-a/(b/c))', sign: Sign.Positive },
            // { input: '-(a/b/c)', children: ['a', '(b/c)'], toString: '-(a/(b/c))', sign: Sign.Negative },
        ];

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Rational(test.input));
        mathObjectConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const parsed = StringFormatter.parseRationalExpressions(test.input);
            return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator));
        });

        factorConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Rational(test.input));
        factorConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const parsed = StringFormatter.parseRationalExpressions(test.input);
            return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator));
        });

        rationalConstructorTests('STANDARD Constructor', constructorTests, (test: FactorConstTest) => new Rational(test.input));
        rationalConstructorTests('STATIC Constructor', constructorTests, (test: FactorConstTest) => {
            const parsed = StringFormatter.parseRationalExpressions(test.input);
            return Rational.fromFactors(Factory.buildFactor(parsed.numerator), Factory.buildFactor(parsed.denominator));
        });

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});