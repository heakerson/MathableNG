import { Sign } from "src/models/math-object/enums.model";
import { Expression } from "src/models/math-object/factor/expression.model";
import { Rational } from "src/models/math-object/factor/rational.model";
import { StringFormatter } from "src/models/services/string-formatter.service";
import { mathObjectConstructorTests } from "../math-object.spec";
import { factorConstructorTests } from "./factor.spec";

export function rationalConstructorTests<TRational extends Rational>(
    additionalLabel: string,
    tests: { input: string, children: string[], toString: string, sign: Sign }[],
    builder: (input: string) => TRational
): void {

    describe(`Rational Constructor Tests => ${additionalLabel}`, () => {
        tests.forEach(test => {
            it(`'${test.input}' => should populate base properties correctly`, () => {
                const mo: TRational = builder(test.input);
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
            // { input: 'a/b', children: ['a', 'b'], toString: '(a/b)', sign: Sign.Positive },
        ];

        mathObjectConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Rational(input));
        mathObjectConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parseRationalExpressions(input);
            return Rational.fromExpressions(new Expression(parsed.numerator), new Expression(parsed.denominator));
        });

        factorConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Rational(input));
        factorConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parseRationalExpressions(input);
            return Rational.fromExpressions(new Expression(parsed.numerator), new Expression(parsed.denominator));
        });

        rationalConstructorTests('STANDARD Constructor', constructorTests, (input: string) => new Rational(input));
        rationalConstructorTests('STATIC Constructor', constructorTests, (input: string) => {
            const parsed = StringFormatter.parseRationalExpressions(input);
            return Rational.fromExpressions(new Expression(parsed.numerator), new Expression(parsed.denominator));
        });

    });

    describe('Individual Methods', () => {

        describe('', () => {

        });
    });
});